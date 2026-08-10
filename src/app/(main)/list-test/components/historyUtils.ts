export function getUserName(user_id: string | number, userList: any[]) {
    const user = userList?.find((u) => String(u.id) === String(user_id));
    return user ? user.name : `User ${user_id}`;
}