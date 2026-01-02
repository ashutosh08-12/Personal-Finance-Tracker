import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Analytics from "./Analytics";

export default function Dashboard() {
  

  return (
    <>
      {/* <Navbar /> */}
      <Analytics/>
    </>
  );
}
