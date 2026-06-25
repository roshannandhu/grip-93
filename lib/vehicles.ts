import type { Vehicle } from "./types";

// Compact make → model → years + compatible sizes map for the "search by vehicle" flow.
export const VEHICLES: Vehicle[] = [
  {
    make: "Maruti Suzuki",
    models: [
      { name: "Swift", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], sizes: ["185/65 R15", "175/65 R15"] },
      { name: "Baleno", years: [2019, 2020, 2021, 2022, 2023, 2024], sizes: ["185/65 R15", "195/55 R16"] },
      { name: "Brezza", years: [2020, 2021, 2022, 2023, 2024], sizes: ["215/60 R17"] },
    ],
  },
  {
    make: "Hyundai",
    models: [
      { name: "i20", years: [2019, 2020, 2021, 2022, 2023, 2024], sizes: ["195/55 R16", "185/65 R15"] },
      { name: "Creta", years: [2019, 2020, 2021, 2022, 2023, 2024], sizes: ["215/60 R17", "235/60 R18"] },
      { name: "Venue", years: [2020, 2021, 2022, 2023, 2024], sizes: ["215/60 R17"] },
    ],
  },
  {
    make: "Honda",
    models: [
      { name: "City", years: [2018, 2019, 2020, 2021, 2022, 2023], sizes: ["185/65 R15", "195/55 R16"] },
      { name: "Amaze", years: [2019, 2020, 2021, 2022, 2023], sizes: ["175/65 R15"] },
    ],
  },
  {
    make: "Tata",
    models: [
      { name: "Nexon", years: [2020, 2021, 2022, 2023, 2024], sizes: ["215/60 R16", "215/60 R17"] },
      { name: "Punch", years: [2021, 2022, 2023, 2024], sizes: ["195/60 R16"] },
    ],
  },
  {
    make: "Mahindra",
    models: [
      { name: "XUV500", years: [2018, 2019, 2020, 2021], sizes: ["235/65 R17"] },
      { name: "Scorpio", years: [2020, 2021, 2022, 2023], sizes: ["255/60 R18", "235/65 R17"] },
    ],
  },
  {
    make: "Toyota",
    models: [
      { name: "Innova", years: [2018, 2019, 2020, 2021, 2022], sizes: ["215/65 R16", "205/65 R16"] },
      { name: "Fortuner", years: [2019, 2020, 2021, 2022], sizes: ["265/60 R18"] },
    ],
  },
  {
    make: "Royal Enfield",
    models: [
      { name: "Classic 350", years: [2021, 2022, 2023, 2024], sizes: ["90/90 R19", "120/80 R18"] },
      { name: "Meteor 350", years: [2021, 2022, 2023, 2024], sizes: ["100/90 R19", "140/70 R17"] },
    ],
  },
  {
    make: "Bajaj",
    models: [
      { name: "Pulsar 150", years: [2019, 2020, 2021, 2022, 2023], sizes: ["90/90 R17", "120/80 R17"] },
    ],
  },
];

export const MAKES = VEHICLES.map((v) => v.make);
