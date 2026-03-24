// Route data for the Train List page
export interface BookingTrain {
  id: string;
  number: string;
  name: string;
  direction: "Up" | "Down";
  route: string;
  image: string;
}

export interface BookingRoute {
  id: string;
  direction: "Up" | "Down";
  label: string;
  stops: string[];
  trains: BookingTrain[];
}

export const bookingRoutes: BookingRoute[] = [
  {
    id: "up",
    direction: "Up",
    label: "Up Direction",
    stops: ["Howrah", "Bardhaman", "Durgapur"],
    trains: [
      {
        id: "12303",
        number: "12303",
        name: "Poorva Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-rajdhani.dim_320x180.jpg",
      },
      {
        id: "22321",
        number: "22321",
        name: "Hool Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-shatabdi.dim_320x180.jpg",
      },
      {
        id: "22387",
        number: "22387",
        name: "Black Diamond Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-vande-bharat.dim_320x180.jpg",
      },
      {
        id: "11448",
        number: "11448",
        name: "Shaktipunj Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-duronto.dim_320x180.jpg",
      },
      {
        id: "13045",
        number: "13045",
        name: "Mayurakshi Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-superfast.dim_320x180.jpg",
      },
      {
        id: "12339",
        number: "12339",
        name: "Coalfield Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-express.dim_320x180.jpg",
      },
      {
        id: "12311",
        number: "12311",
        name: "Netaji Express",
        direction: "Up",
        route: "Howrah → Bardhaman → Durgapur",
        image: "/assets/generated/train-humsafar.dim_320x180.jpg",
      },
    ],
  },
  {
    id: "down",
    direction: "Down",
    label: "Down Direction",
    stops: ["Durgapur", "Bardhaman", "Howrah"],
    trains: [
      {
        id: "12304",
        number: "12304",
        name: "Poorva Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-rajdhani.dim_320x180.jpg",
      },
      {
        id: "22322",
        number: "22322",
        name: "Hool Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-shatabdi.dim_320x180.jpg",
      },
      {
        id: "22388",
        number: "22388",
        name: "Black Diamond Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-vande-bharat.dim_320x180.jpg",
      },
      {
        id: "11447",
        number: "11447",
        name: "Shaktipunj Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-duronto.dim_320x180.jpg",
      },
      {
        id: "13046",
        number: "13046",
        name: "Mayurakshi Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-superfast.dim_320x180.jpg",
      },
      {
        id: "12340",
        number: "12340",
        name: "Coalfield Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-express.dim_320x180.jpg",
      },
      {
        id: "12312",
        number: "12312",
        name: "Netaji Express",
        direction: "Down",
        route: "Durgapur → Bardhaman → Howrah",
        image: "/assets/generated/train-humsafar.dim_320x180.jpg",
      },
    ],
  },
];
