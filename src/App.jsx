import React, { useState, useEffect } from "react";
import "./App.css";

const BUDGET_LIMIT = 50000;
const STORAGE_KEY = "Bircube's Budget Calculator";

const initialExpenses = {
  officeSupplies: "",
  salaries: "",
  travel: "",
  food: "",
};

