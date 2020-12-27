import React, { FC, MouseEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MyPopover } from "./MyPopover";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  app: {
    padding: "10px",
    background: "red",
  },
}));

type NullableElementType = HTMLElement | null;

export const Step2 = () => {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<NullableElementType>(null);

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as NullableElementType);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const Footer: FC = () => <div>This is my footer</div>
  const Header: FC = () => <div>This is my header</div>

  return (
    <div className={styles.app}>
      <Button onClick={handleClick}>open popover</Button>
      <MyPopover
        open={open}
        handleClose={handleClose}
        anchorPosition={{ top: 200, left: 200 }}
        footer={<Footer />}
        header={<Header />}
      >
        <h1>Hello Popover</h1>
        <p>I'm a nice popover</p>
      </MyPopover>
    </div>
  );
};
