import { enums } from "../constants/enum";

const ApiUrl = import.meta.env.VITE_API_URL;

export const getData = async (apiPath, method, body = null, token) => {
  try {
    const fetchOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }
    const response = await fetch(`${ApiUrl}/${apiPath}`, fetchOptions);
    if (response.status === enums.HttpStatus.OK) {
      return response;
    }

    if (response.status === enums.HttpStatus.UNAUTHORIZED) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
};
