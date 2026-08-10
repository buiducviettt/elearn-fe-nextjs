"use client";
import { useState, useRef } from "react";
import { Select, Spin } from "antd";
import { userService } from "@/services/user";
import MyEmpty from "@/bases/MyEmpty";

type UserSelectProps = {
  selectedUser: string;
  onSelectUser: (val: string) => void;
  loading?: boolean;
};

const UserSelect: React.FC<UserSelectProps> = ({ selectedUser, onSelectUser, loading }) => {
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  // Hàm fetch user cho select search (search remote)
  const fetchUserOptions = async (keyword: string) => {
    setUserSearchLoading(true);
    const res = await userService.get({ per_page: 20, search: keyword });
    setUserOptions(
      (res.payload || []).map((u: any) => ({
        label: u.name,
        value: String(u.id),
      }))
    );
    setUserSearchLoading(false);
  };

  // Debounce search
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleUserSearch = (keyword: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!keyword) {
      setUserOptions([]);
      return;
    }
    searchTimeout.current = setTimeout(() => {
      fetchUserOptions(keyword);
    }, 400);
  };

  return (
    <Select
      className="w-64 flex-shrink-0"
      showSearch
      allowClear
      placeholder="Tìm kiếm user"
      options={userOptions}
      value={selectedUser || undefined}
      onSearch={handleUserSearch}
      onFocus={(e) => {
        if (!(e.target as HTMLInputElement).value) setUserOptions([]);
      }}
      onChange={onSelectUser}
      loading={userSearchLoading || loading}
      filterOption={false}
      notFoundContent={
        <div style={{ minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {userSearchLoading || loading ? <Spin size="small" /> : <MyEmpty />}
        </div>
      }
    />
  );
};

export default UserSelect;