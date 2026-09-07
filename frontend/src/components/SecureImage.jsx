import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const SecureImage = ({ filename, alt = "https://placehold.co/600x400", width = "100%", height = "auto" }) => {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      if (!filename) return;

      try {
        const response = await axiosInstance.get(`/api/images/${filename}`, {
          responseType: "arraybuffer",
        });

        const mimeType = response.headers["content-type"];

        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setImgSrc(`data:${mimeType};base64,${base64}`);
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    fetchImage();
  }, [filename]);

  if (!filename) return <div>No image available</div>;

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={{ width, height, objectFit: "cover" }}
    />
  );
};

export default SecureImage;
