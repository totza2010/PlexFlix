import { apiEndpoints } from "globals/constants";
import { fetchOptions } from "src/utils/helper";

// GET requsts

export const getCompanies = async ({ companiesId, type }) => {
  const companyRes = await fetch(
    type === "production" ? apiEndpoints.company.companyDetails(companiesId) : apiEndpoints.network.networkDetails(companiesId), fetchOptions()
  );

  if (companyRes?.ok) {
    const data = await companyRes.json();
    return {
      success: true,
      ...data
    };
  } else {
    return {
      success: false
    };
  }
};