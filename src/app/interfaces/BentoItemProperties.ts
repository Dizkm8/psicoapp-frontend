import React from "react";

export default interface BentoItemProperties{
    children: React.ReactNode;
    key?: any,
    title: string;
    subtitle: string;
    onClick: () => void;
}