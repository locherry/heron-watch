import {
  ComponentProps,
  FC,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { Drawer } from "vaul";
import { BSHandleProps, BottomSheetViewProps } from "./types";
import { convertSnapPoints } from "./util";

const BottomSheet = Fragment;

const BottomSheetView = forwardRef<
  HTMLDivElement,
  BottomSheetViewProps & {
    showHandle?: boolean;
    title?: string;
  }
>(
  (
    {
      children,
      className,
      title = "Universal Bottom Sheet",
      showHandle = true,
    },
    ref,
  ) => (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60" />

      <Drawer.Content
        ref={ref}
        className={`bg-background border-t border-border shadow-lg flex flex-col rounded-t-[10px] h-full mt-24 fixed bottom-0 left-0 right-0 ${className ?? ""}`}
      >
        <Drawer.Title className="sr-only">{title}</Drawer.Title>

        {showHandle && <Drawer.Handle className="mt-2" />}

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </Drawer.Content>
    </Drawer.Portal>
  ),
);

const BottomSheetModalProvider = Fragment;

export type BottomSheetModal = {
  present: () => void;
  dismiss: () => void;
};

type BottomSheetModalProps = ComponentProps<typeof Drawer.Root> & {
  children: React.ReactNode;
  snapPoints?: string[];
  index?: number;
  onChange?: (index: number) => void;
};

const BottomSheetModal = forwardRef<BottomSheetModal, BottomSheetModalProps>(
  ({ children, snapPoints, onChange, ...rest }, ref) => {
    const [open, setOpen] = useState(false);

    const combinedSnapPoints = useMemo(
      () => convertSnapPoints(snapPoints ?? []),
      [snapPoints],
    );

    useImperativeHandle(
      ref,
      () => ({
        present: () => setOpen(true),
        dismiss: () => setOpen(false),
      }),
      [],
    );

    return (
      <Drawer.Root
        {...rest}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onChange?.(next ? 0 : -1);
        }}
        snapPoints={combinedSnapPoints}
      >
        {children}
      </Drawer.Root>
    );
  },
);

const BottomSheetScrollView = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const BottomSheetTrigger = Platform.OS === "web" ? Drawer.Trigger : Fragment;

const BottomSheetHandle: FC<
  BSHandleProps & {
    className?: string;
    animatedIndex?: number;
    animatedPosition?: number;
  }
> = ({ animatedIndex, animatedPosition, ...rest }) => {
  if (Platform.OS !== "web") {
    return <Fragment />;
  }

  return <Drawer.Handle {...rest} />;
};

export {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTrigger,
  BottomSheetView
};

