export interface Train {
  id: string;
  number: string;
  name: string;
  type: string;
  from: string;
  to: string;
  image: string;
  duration: string;
  fare: number;
}

// Unique image map per train name
const trainImages: Record<string, string> = {
  "Poorva Express": "/assets/generated/train-poorva-express.dim_320x180.jpg",
  "Hool Express": "/assets/generated/train-hool-express.dim_320x180.jpg",
  "Black Diamond Express":
    "/assets/generated/train-black-diamond-express.dim_320x180.jpg",
  "Shaktipunj Express":
    "/assets/generated/train-shaktipunj-express.dim_320x180.jpg",
  "Mayurakshi Express":
    "/assets/generated/train-mayurakshi-express.dim_320x180.jpg",
  "Coalfield Express":
    "/assets/generated/train-coalfield-express.dim_320x180.jpg",
  "Netaji Express": "/assets/generated/train-netaji-express.dim_320x180.jpg",
};

// Up Direction: Howrah → Bardhaman → Durgapur
const upTrains: Train[] = [
  {
    id: "12303",
    number: "12303",
    name: "Poorva Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Poorva Express"],
    duration: "2h 30m",
    fare: 0,
  },
  {
    id: "22321",
    number: "22321",
    name: "Hool Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Hool Express"],
    duration: "2h 45m",
    fare: 0,
  },
  {
    id: "22387",
    number: "22387",
    name: "Black Diamond Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Black Diamond Express"],
    duration: "2h 20m",
    fare: 0,
  },
  {
    id: "11448",
    number: "11448",
    name: "Shaktipunj Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Shaktipunj Express"],
    duration: "2h 50m",
    fare: 0,
  },
  {
    id: "13045",
    number: "13045",
    name: "Mayurakshi Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Mayurakshi Express"],
    duration: "3h 00m",
    fare: 0,
  },
  {
    id: "12339",
    number: "12339",
    name: "Coalfield Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Coalfield Express"],
    duration: "2h 40m",
    fare: 0,
  },
  {
    id: "12311",
    number: "12311",
    name: "Netaji Express",
    type: "Express",
    from: "Howrah",
    to: "Durgapur",
    image: trainImages["Netaji Express"],
    duration: "2h 35m",
    fare: 0,
  },
];

// Down Direction: Durgapur → Bardhaman → Howrah
const downTrains: Train[] = [
  {
    id: "12304",
    number: "12304",
    name: "Poorva Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Poorva Express"],
    duration: "2h 30m",
    fare: 0,
  },
  {
    id: "22322",
    number: "22322",
    name: "Hool Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Hool Express"],
    duration: "2h 45m",
    fare: 0,
  },
  {
    id: "22388",
    number: "22388",
    name: "Black Diamond Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Black Diamond Express"],
    duration: "2h 20m",
    fare: 0,
  },
  {
    id: "11447",
    number: "11447",
    name: "Shaktipunj Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Shaktipunj Express"],
    duration: "2h 50m",
    fare: 0,
  },
  {
    id: "13046",
    number: "13046",
    name: "Mayurakshi Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Mayurakshi Express"],
    duration: "3h 00m",
    fare: 0,
  },
  {
    id: "12340",
    number: "12340",
    name: "Coalfield Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Coalfield Express"],
    duration: "2h 40m",
    fare: 0,
  },
  {
    id: "12312",
    number: "12312",
    name: "Netaji Express",
    type: "Express",
    from: "Durgapur",
    to: "Howrah",
    image: trainImages["Netaji Express"],
    duration: "2h 35m",
    fare: 0,
  },
];

export const trains: Train[] = [...upTrains, ...downTrains];

// Only 3 stations
export const stations = ["Howrah", "Barddhaman", "Durgapur"];

// Station images for display during selection
export const stationImages: Record<string, string> = {
  Howrah: "/assets/generated/station-howrah.dim_400x220.jpg",
  Barddhaman: "/assets/generated/station-barddhaman.dim_400x220.jpg",
  Durgapur: "/assets/generated/station-durgapur.dim_400x220.jpg",
};

export const stationCoords: Record<string, [number, number]> = {
  Howrah: [22.5839, 88.3424],
  Barddhaman: [23.2324, 87.8615],
  Durgapur: [23.4796, 87.3119],
};
