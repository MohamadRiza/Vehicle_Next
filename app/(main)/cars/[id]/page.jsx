import React from "react";

const Carpage = async ({ params }) => {
  const { id } = await params;

  return <div>CarPage: {id}</div>;
};

export default Carpage;
