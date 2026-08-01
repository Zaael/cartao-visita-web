import React from "react";
import type { GatsbyBrowser } from "gatsby";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

import "./src/styles/global.css";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
    element,
}) => {
    return <MantineProvider>{element}</MantineProvider>;
};
