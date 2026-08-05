// Geographic hierarchy: Constituency -> Mandal -> Village.
// Structured as data (not hardcoded strings in components) so more
// constituencies can be added later without touching page code.

export const CONSTITUENCY = {
  id: "avanigadda",
  name: "Avanigadda Constituency",
};

export const MANDALS = [
  {
    id: "avanigadda",
    name: "Avanigadda Mandal",
    villages: [
      "Aswaraopalem",
      "Avanigadda",
      "Chiruvolu Lanka",
      "Edlanka",
      "Modumudi",
      "Puligadda",
      "Vekanuru",
    ],
  },
  {
    id: "nagayalanka",
    name: "Nagayalanka Mandal",
    villages: [
      "Bhavadevarapalle",
      "Chodavaram",
      "Edurumondi",
      "Etimoga",
      "Ganapeswaram",
      "Kammanamolu",
      "Nagayalanka",
      "Nangegadda",
      "Parrachivara",
      "T. Kothapalem",
      "Talagadadeevi",
    ],
  },
  {
    id: "koduru",
    name: "Koduru Mandal",
    villages: [
      "Koduru",
      "Lingareddipalem",
      "Machavaram",
      "Mandapakala",
      "Pittallanka",
      "Ramakrishnapuram",
      "Salempalem",
      "Ullipalem",
      "Viswanadhapalle",
    ],
  },
  {
    id: "challapalli",
    name: "Challapalli Mandal",
    villages: [
      "Challapalli",
      "Cheedepudi",
      "Lakshmipuram",
      "Majeru",
      "Mangalapuram",
      "Nadakuduru",
      "Nimmagadda",
      "Pagolu",
      "Puritigadda",
      "Vakkalagadda",
      "Velivolu",
      "Yarlagadda",
      "Nukala Vaari Palem",
    ],
  },
  {
    id: "mopidevi",
    name: "Mopidevi Mandal",
    villages: [
      "Annavaram",
      "Ayodhya",
      "Bobbarlanka",
      "Chiruvolu",
      "Kaptanupalem",
      "Kokkiligadda",
      "Kosuruvaripalem",
      "Mellamarru",
      "Mellamarthi Lanka",
      "Merakanapalle",
      "Mopidevi",
      "Mopidevi Lanka",
      "Nagayathippa",
      "North Chiruvolulanka",
      "Pedakallepalli",
      "Pedaprolu",
      "Tekupalle",
      "Venkatapuram",
    ],
  },
  {
    id: "ghantasala",
    name: "Ghantasala Mandal",
    villages: [
      "Birudugadda",
      "Bollapadu",
      "Chilakalapudi",
      "China Kallepalle",
      "Chitturpu",
      "Chitturu",
      "Daliparru",
      "Devarakota",
      "Elikala Kuduru",
      "Endakuduru",
      "Ghantasala",
      "Kodali",
      "Kothapalle",
      "Lankapalle",
      "Mallampalle",
      "Pushadam",
      "Srikakulam",
      "Tadepalle",
      "Teluguraopalem",
      "Vrudravaram",
      "Vemulapalle",
    ],
  },
];

export const getMandalById = (id) => MANDALS.find((m) => m.id === id);

export const getVillagesForMandal = (mandalId) =>
  getMandalById(mandalId)?.villages ?? [];

export const allVillagesFlat = MANDALS.flatMap((m) =>
  m.villages.map((v) => ({ village: v, mandalId: m.id, mandalName: m.name }))
);
