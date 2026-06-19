
import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // TODO: Check if user is logged in, redirect accordingly
  return <Redirect href="/welcome"/>
}
