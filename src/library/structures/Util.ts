export default class Util {
  public static stringify(query: object, seperator = "&", equal = "=") {
    return Object.keys(query)
      .map((key) =>
        encodeURIComponent(
          `${key}${equal}${
            Array.isArray(key) ? query[key].join(seperator) : query[key]
          }`
        )
      )
      .join(seperator);
  }

  public static formatTime(duration: number) {
    const hours = Math.floor((duration / (1e3 * 60 * 60)) % 60),
      minutes = Math.floor(duration / 6e4),
      seconds = ((duration % 6e4) / 1e3).toFixed(0);

    //@ts-ignore
    return `${
      hours ? `${hours.toString().padStart(2, "0")}:` : ""
    }${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
