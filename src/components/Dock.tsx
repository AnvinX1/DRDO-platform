'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 ${className}`}
      style={{ width: baseItemSize, height: baseItemSize }}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: boolean;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -8, scale: 1 }}
          exit={{ opacity: 0, y: 0, scale: 0.8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center text-slate-600 ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50
}: DockProps) {
  return (
    <div className="flex max-w-full items-center justify-center p-3">
      <motion.div
        className={`${className} flex items-end w-fit gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm pb-2 px-4 shadow-sm`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {items.map((item, index) => (
          <DockItemWrapper key={index} item={item} baseItemSize={baseItemSize} />
        ))}
      </motion.div>
    </div>
  );
}

function DockItemWrapper({ item, baseItemSize }: { item: DockItemData; baseItemSize: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <DockItem
        onClick={item.onClick}
        className={item.className}
        mouseX={useMotionValue(0)}
        spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
        distance={200}
        magnification={70}
        baseItemSize={baseItemSize}
      >
        <DockIcon>{item.icon}</DockIcon>
        <DockLabel isHovered={isHovered}>{item.label}</DockLabel>
      </DockItem>
    </div>
  );
}
