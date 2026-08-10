"use client";
import { Skeleton } from "antd";
import {
  createContext,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { tv, VariantProps } from "tailwind-variants";
import MyEmpty from "../MyEmpty";
import MyRawButton from "../MyRawButton";

// ✅ Made MyGroupSelect a generic component with TValue
export type TMyGroupSelectProps<TValue = string | number> = {
  value?: TValue | undefined;
  loading?: boolean;
  allowClear?: boolean;
  modalConfirm?: ({
    showConfirm,
    valueSelected,
    valueCurrent,
    setShowConfirm,
    change,
  }: {
    showConfirm: boolean;
    valueSelected: TValue | undefined;
    valueCurrent: TValue | undefined;
    setShowConfirm: Dispatch<SetStateAction<boolean>>;
    change: (value: TValue | undefined) => void;
  }) => React.ReactNode;
  onChange?: (value: TValue | undefined) => void;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  isEmpty?: boolean;
  children?: React.ReactNode;
} & VariantProps<typeof styles>;

const styles = tv({
  slots: {
    container: "px-1.5 py-1.5 flex flex-wrap gap-2 rounded-md border",
    itemContainer:
      "font-medium flex-1 flex-shrink-0 flex-wrap px-3 py-1.5 rounded-md transition-all",
  },
  variants: {
    color: {
      primary: {
        container: "bg-white",
      },
      secondary: {
        container: "bg-stone-50",
      },
    },
  },
});

const itemStyles = tv({
  slots: {
    base: "font-medium flex-1 flex-shrink-0 flex-wrap px-3 py-1.5 rounded-md transition-all",
    active: "",
    inactive: "",
  },
  variants: {
    color: {
      primary: {
        active: "bg-primary text-white",
        inactive: "text-gray-500",
      },
      secondary: {
        active:
          "bg-white shadow-md outline outline-1 text-gray-900 outline-primary",
        inactive: "text-gray-500",
      },
    },
  },
});

// ✅ Made WrapperContext generic
const WrapperContext = createContext<{
  value: any; // Kept as 'any' since it initializes without knowing TValue
  onChange: (value: any) => void;
  color: TMyGroupSelectProps<any>["color"];
}>({
  value: "", // Placeholder, actual value depends on usage
  onChange: () => {},
  color: "secondary",
});

// ✅ Updated MyGroupSelect to be generic
const MyGroupSelect = <TValue,>(
  props: TMyGroupSelectProps<TValue | undefined>,
) => {
  const {
    value,
    allowClear = false,
    color = "secondary",
    onChange,
    loading = false,
    children,
    isEmpty = false,
    modalConfirm,
    className = "",
  } = props;

  const [currentValueSelected, setCurrentValueSelected] = useState<
    TValue | undefined
  >(undefined);
  const [insideValue, setInsideValue] = useState<TValue | undefined>(undefined);
  const [showConfirm, setShowConfirm] = useState(false);

  const { container } = styles({ color });

  const finalValue = value ?? insideValue; // ✅ Ensures 0 is not treated as falsy
  const change = (onChange ?? setInsideValue) as (
    value: TValue | undefined,
  ) => void;

  const finalChange = (newValue: TValue) => {
    if (allowClear && newValue === finalValue) {
      // clear value
      change(undefined);
      return;
    }
    if (typeof modalConfirm === "function") {
      setCurrentValueSelected(newValue);
      setShowConfirm(true);
      return;
    }
    change(newValue);
  };

  return (
    <WrapperContext.Provider
      value={{
        value: finalValue,
        onChange: finalChange,
        color: color,
      }}
    >
      <div className={container({ className })}>
        {!loading && children}
        {loading && (
          <Skeleton.Button active size="small" block shape="square" />
        )}
        {!loading && isEmpty && (
          <div className="flex-1 justify-center flex">
            <MyEmpty />
          </div>
        )}
      </div>
      {typeof modalConfirm === "function" &&
        modalConfirm?.({
          showConfirm,
          valueSelected: currentValueSelected!,
          valueCurrent: finalValue!,
          setShowConfirm,
          change,
        })}
    </WrapperContext.Provider>
  );
};

// ✅ Updated Item component to be generic
type TItem<TValue> = {
  value: TValue;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

const Item = <TValue extends string | number>(props: TItem<TValue>) => {
  const { value: itemValue, children, className = "" } = props;

  const { onChange, value, color } = useContext(WrapperContext);
  const { active, inactive, base } = itemStyles({ color });
  const isActive = value === itemValue;

  return (
    <MyRawButton
      onClick={() => {
        onChange(itemValue);
      }}
      className={`${base()} ${isActive ? active() : inactive()} ${className}`}
    >
      {children}
    </MyRawButton>
  );
};

MyGroupSelect.Item = Item as any; // ✅ Type assertion to prevent TypeScript issues

export default MyGroupSelect;
