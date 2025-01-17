import React, { useState, useEffect } from "react";
import { default as ReactModal } from "react-responsive-modal";
import clsx from "clsx";
import { Icon } from "~/uikit";
import styles from "./Modal.module.css";

type IModalSize = "medium";

type TModalProps = {
  className?: string;
  children?: React.ReactNode;
  size?: IModalSize;
  isOpen: boolean;
  onCloseModal: () => void;
};

export const Modal = ({
  className,
  children,
  size = "medium",
  isOpen,
  onCloseModal,
}: TModalProps): JSX.Element => {
  const defaultClassNames = {
    modal: clsx("ModalDefault", className, {
      ModalDefault__medium: size === "medium",
    }),
    closeButton: clsx("ModalDefaultCloseButton"),
  };
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isOpen && scrollbarWidth) {
      const _styles = {
        modal: { marginRight: `${scrollbarWidth + 16}px` },
      };
      setStyles(_styles);
      document.body.classList.add("Modal__open");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      setStyles({});
      document.body.style.removeProperty("padding-right");
      document.body.classList.remove("Modal__open");
    };
  }, [isOpen]);

  return (
    <ReactModal
      classNames={defaultClassNames}
      center
      closeIcon={<Icon type="Close" />}
      styles={styles}
      open={isOpen}
      onClose={onCloseModal}
    >
      <div className="Modal">{children}</div>
    </ReactModal>
  );
};

type TModalHeaderProps = {
  className?: string;
  align?: "start" | "center" | "end";
  children?: React.ReactNode;
};

// eslint-disable-next-line react/display-name
Modal.Header = ({ className, align, children }: TModalHeaderProps): JSX.Element => {
  return (
    <div
      className={clsx("ModalHeader", className, {
        ModalHeader__start: align === "start",
        ModalHeader__center: align === "center",
        ModalHeader__end: align === "end",
      })}
    >
      {children}
    </div>
  );
};

type TModalContentProps = {
  children?: React.ReactNode;
  className?: string;
};

// eslint-disable-next-line react/display-name
Modal.Content = ({ className, children }: TModalContentProps): JSX.Element => {
  return <div className={clsx("ModalContent", className)}>{children}</div>;
};

type TModalFooterProps = {
  className?: string;
  children?: React.ReactNode;
};

// eslint-disable-next-line react/display-name
Modal.Footer = ({ children, className }: TModalFooterProps): JSX.Element => {
  return <div className={clsx("ModalFooter", className)}>{children}</div>;
};

export function modalLinks() {
  return [{ rel: "stylesheet", href: styles }];
}
