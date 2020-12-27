import React, { FC, ReactNode } from "react";
import Popover, { PopoverPosition } from "@material-ui/core/Popover";

interface CloseHandler {
  (): void;
}

interface MyPopoverProps {
  open: boolean;
  handleClose: CloseHandler;
  anchorPosition: PopoverPosition;
  footer?: ReactNode;
  header?: ReactNode;
}

export const MyPopover: FC<MyPopoverProps> = (props) => {
  const { open, handleClose, children, anchorPosition, footer, header } = props;

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <>
        {header}
        {children}
        {footer}
      </>
    </Popover>
  );
};
