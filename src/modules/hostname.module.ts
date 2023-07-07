const getHostname = (hostname: string) => {
  if (
    hostname === "http://localhost:4200" ||
    hostname === "http://192.168.1.23:4200"
  ) {
    return "demodolly";
  } else {
    const name = hostname.replace(/(^\w+:|^)\/\//, "");
    return name
      .replace(new RegExp("[a-z-0-9]{2,63}.[a-z.]{2,5}$").exec(name)![0], "")
      .slice(0, -1);
  }
};

export default getHostname;
