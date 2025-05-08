import React from "react";

const waitlist = () => {
  return (
    <div className="mt-20 fixed w-full">
      <div className="aspect-video w-full">
        <iframe
          style={{width: "100%"}}
          height="569"
          src="https://vehicle-wait-riza.created.app"
          title="Waiting List Landing Page"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default waitlist;
