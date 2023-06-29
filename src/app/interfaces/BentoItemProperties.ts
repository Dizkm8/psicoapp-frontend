import React from "react";

export default interface BentoItemProperties{
    children: React.ReactNode;
    key?: any,
    title: string;
    subtitle: React.ReactNode;
    onClick: () => void;
}