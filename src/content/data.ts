export type Animal = {
  name: string;
  slug: string;
  species: "Dog" | "Cat";
  image: string;
  excerpt: string;
  story: string[];
};

const shelterAnimals: {
  name: string;
  species: Animal["species"];
  image: string;
}[] = [
  { name: "Baby", species: "Dog", image: "/images/animals/baby.png" },
  { name: "Badi Kali", species: "Dog", image: "/images/animals/badi-kali.png" },
  { name: "Candy", species: "Dog", image: "/images/animals/candy.png" },
  {
    name: "Choti Kali",
    species: "Dog",
    image: "/images/animals/choti-kali.jpg",
  },
  { name: "Chunti", species: "Dog", image: "/images/animals/chunti.png" },
  { name: "Dony", species: "Dog", image: "/images/animals/dony.png" },
  { name: "Jasmin", species: "Dog", image: "/images/animals/jasmin.png" },
  { name: "Lucy", species: "Dog", image: "/images/animals/lucy.png" },
  { name: "Nakali", species: "Dog", image: "/images/animals/nakali.png" },
  { name: "Nemo", species: "Dog", image: "/images/animals/nemo.png" },
  { name: "Oxsa", species: "Dog", image: "/images/animals/oxsa.png" },
  { name: "Puku", species: "Dog", image: "/images/animals/puku.png" },
  { name: "Sam", species: "Dog", image: "/images/animals/sam.png" },
  { name: "Sana", species: "Dog", image: "/images/animals/sana.png" },
  { name: "Sumnima", species: "Dog", image: "/images/animals/sumnima.png" },
  { name: "Tiku", species: "Dog", image: "/images/animals/tiku.png" },
  { name: "Tinu", species: "Dog", image: "/images/animals/tinu.png" },
  { name: "Betali", species: "Cat", image: "/images/animals/betali.png" },
  { name: "Jinju", species: "Cat", image: "/images/animals/jinju.png" },
  { name: "Mimi", species: "Cat", image: "/images/animals/mimi.png" },
  { name: "Sweaty", species: "Cat", image: "/images/animals/sweaty.png" },
];

const profiles: Record<string, { excerpt: string; story: string[] }> = {
  Puku: {
    excerpt: "Sweet, mischievous and always ready for a tiny adventure.",
    story: [
      "Puku arrived at the shelter gate when he was a small puppy after roaming near the Thapathali Pool. Although many male puppies find homes, Puku stayed and grew up with Oxsa Nepal.",
      "He enjoys watching the road and occasionally slips through an open door, only to return from his little adventure a few minutes later. Sponsorship helps provide the steady food, shelter and care he depends on.",
    ],
  },
  Candy: {
    excerpt: "A gentle shelter resident who values calm company.",
    story: [
      "Candy is one of the animals who depends on Oxsa Nepal for daily food, safety and care.",
      "Monthly sponsorship helps make that care dependable and gives the shelter a steadier foundation for planning.",
    ],
  },
  Dony: {
    excerpt: "A much-loved member of the Oxsa shelter family.",
    story: [
      "Dony lives in Oxsa Nepal's care and is part of its monthly sponsorship programme.",
      "A sponsor can contribute to his everyday food, shelter and access to medical support when it is needed.",
    ],
  },
  Chunti: {
    excerpt: "Learning that safety can feel like freedom.",
    story: [
      "Chunti's journey is connected with recovery from life in a cage and the patient work of rebuilding trust.",
      "Sponsorship supports the calm routines and consistent care on which that trust depends.",
    ],
  },
  Tinu: {
    excerpt: "The shelter's watchful and affectionate guardian.",
    story: [
      "Tinu is remembered in Oxsa Nepal's writing as the shelter's adorable guardian.",
      "Monthly support helps provide the everyday care that keeps Tinu safe at the shelter.",
    ],
  },
  Nakali: {
    excerpt: "A resilient animal whose trust grew with patient care.",
    story: [
      "Nakali's story is connected with Chunti's journey from confinement toward freedom and care.",
      "Sponsorship helps sustain the patient, consistent care behind that recovery.",
    ],
  },
};

export const animals: Animal[] = shelterAnimals.map(
  ({ name, species, image }) => ({
    name,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    species,
    image,
    excerpt:
      profiles[name]?.excerpt ??
      (species === "Cat"
        ? "A feline shelter resident who can be supported from afar."
        : "A shelter resident with an individual story and a need for steady care."),
    story: profiles[name]?.story ?? [
      `${name} is one of the ${species === "Cat" ? "cats" : "animals"} living in Oxsa Nepal's care.`,
      "Monthly sponsorship helps Oxsa Nepal provide consistent food, shelter and care.",
    ],
  }),
);

export const work = [
  {
    id: "spaying",
    title: "Spaying & Neutering",
    short:
      "Humane population management prevents future litters from being born into hunger, illness and danger.",
    body: "Spaying and neutering is one of the most responsible ways to reduce long-term suffering. Oxsa Nepal supports humane population management so fewer animals are born into unsafe conditions.",
  },
  {
    id: "adoption",
    title: "Adoption",
    short:
      "Careful matching helps animals find safe, permanent and responsible homes.",
    body: "Adoption is a lifelong promise. Oxsa Nepal screens prospective homes because a good match protects both the animal and the family welcoming them.",
  },
  {
    id: "feeding",
    title: "Daily Feeding",
    short:
      "Regular meals relieve hunger and help build trust with community animals.",
    body: "Street animals face hunger every day. Regular feeding gives immediate relief and creates the trust needed to notice illness, support vaccination and offer further care.",
  },
  {
    id: "vaccination",
    title: "Vaccination",
    short:
      "Vaccination protects animals and communities from preventable disease.",
    body: "Oxsa Nepal supports vaccination work against serious diseases including rabies and distemper. Prevention protects individual animals and the wider community.",
  },
  {
    id: "awareness",
    title: "Awareness",
    short:
      "Education turns everyday choices into a more compassionate community.",
    body: "Lasting change depends on how people understand and respond to animals. Oxsa Nepal shares practical guidance and encourages community responsibility.",
  },
] as const;

export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  date?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  paragraphs: string[];
  published?: boolean;
};
const article = (
  title: string,
  slug: string,
  excerpt: string,
  category = "Story",
  image?: string,
  imageAlt?: string,
): Article => ({
  title,
  slug,
  excerpt,
  category,
  image,
  imageAlt,
  published: true,
  paragraphs: [
    excerpt,
    "Oxsa Nepal shares this account to encourage patient, practical compassion and a stronger sense of responsibility toward animals in our communities.",
  ],
});

export const stories: Article[] = [
  article(
    "How Kalu Fought Nasal Cancer",
    "how-kalu-fought-nasal-cancer",
    "Kalu's story is about illness, treatment and the determination to keep caring.",
    "Story",
    "/images/stories/how-kalu-fought-nasal-cancer.png",
    "Kalu before and after recovering from nasal cancer",
  ),
  article(
    "Saving a Hit-and-Run Puppy",
    "saving-a-hit-and-run-puppy",
    "A reminder that quick, compassionate action can give an injured puppy a chance.",
    "Story",
    "/images/stories/saving-a-hit-and-run-puppy.png",
    "A rescued puppy resting with a bandaged leg",
  ),
  article(
    "Love Has No Looks: The Story of Timar Kancha",
    "love-has-no-looks",
    "Timar Kancha's story asks us to see worth beyond appearance.",
    "Story",
    "/images/stories/love-has-no-looks.png",
    "Timar Kancha resting outdoors",
  ),
  article(
    "Not Every Cat Is a Natural-Born Hunter",
    "not-every-cat-is-a-natural-born-hunter",
    "A compassionate look at the assumptions people make about cats and survival.",
    "Story",
    "/images/stories/not-every-cat-is-a-natural-born-hunter.png",
    "A close-up portrait of a shelter cat",
  ),
  article(
    "Please Check Under Your Vehicle Before Driving",
    "check-under-your-vehicle",
    "A simple safety habit can prevent terrible injuries to resting street animals.",
    "Story",
    "/images/stories/check-under-your-vehicle.png",
    "A person checking near a parked vehicle where a dog is resting safely",
  ),
  article(
    "The Journey of the Three Kalus",
    "journey-of-the-three-kalus",
    "Three animals, one shared name and a journey toward safety.",
    "Story",
    "/images/stories/journey-of-the-three-kalus.png",
    "Three dogs being cared for beside a street",
  ),
  article(
    "How Two Puppies Chose to Leave the Street",
    "two-puppies-left-the-street",
    "A story about trust, choice and the promise of a safer life.",
    "Story",
    "/images/stories/two-puppies-left-the-street.png",
    "Two puppies at the doorway of a safe shelter",
  ),
  article(
    "A Man With a Golden Heart",
    "a-man-with-a-golden-heart",
    "One person's kindness shows the difference an ordinary neighbour can make.",
    "Story",
    "/images/stories/a-man-with-a-golden-heart.png",
    "A neighbour feeding a community dog outside a shop",
  ),
  article(
    "Remembering Tyau – A Rescued Cat",
    "remembering-tyau",
    "A loving remembrance of Tyau and the life made possible through rescue.",
    "Story",
    "/images/stories/remembering-tyau.png",
    "A rescued tabby-and-white cat resting peacefully on a blanket",
  ),
  article(
    "A Story of Overcoming Superstition",
    "overcoming-superstition",
    "Compassion grows when fear and superstition give way to understanding.",
    "Story",
    "/images/stories/overcoming-superstition.png",
    "A family warmly caring for a black community dog",
  ),
  article(
    "The Story of Pappan – A Crow",
    "pappan-the-crow",
    "Pappan's story widens the circle of care beyond dogs and cats.",
    "Story",
    "/images/stories/pappan-the-crow.png",
    "A healthy crow perched in a shelter garden",
  ),
];

export const blog: Article[] = [
  article(
    "Why Every Dog Should Wear an ID Tag",
    "why-every-dog-needs-an-id-tag",
    "An ID tag is a small step that can help a lost dog return home.",
    "Education",
    "/images/blog/why-every-dog-needs-an-id-tag.png",
    "A community dog wearing a collar with a blank identification tag in a Nepali courtyard",
  ),
  article(
    "From the Streets of Nepal to a Loving Home in Canada",
    "streets-of-nepal-to-canada",
    "A journey from street life in Nepal to a permanent family abroad.",
    "Animal Welfare",
    "/images/blog/streets-of-nepal-to-canada.png",
    "A rescued Nepali dog meeting a welcoming family after air travel",
  ),
  article(
    "Our Shelter's Adorable Guardian: Tinu",
    "shelter-guardian-tinu",
    "Meet Tinu, a familiar and watchful presence at the shelter.",
    "Story",
    "/images/blog/shelter-guardian-tinu.png",
    "An older black shelter dog sitting watchfully near the shelter entrance",
  ),
  article(
    "The Heartbreaking Reality Behind Irresponsible Breeding",
    "irresponsible-breeding",
    "Why breeding decisions must put animal welfare before convenience or profit.",
    "Education",
    "/images/blog/irresponsible-breeding.png",
    "A mother dog resting protectively with puppies in a makeshift shelter",
  ),
  article(
    "A Tale of Trust and Freedom: Pappan the Crow",
    "pappan-trust-and-freedom",
    "Pappan's relationship with people became a lesson in trust and freedom.",
    "Story",
    "/images/blog/pappan-trust-and-freedom.png",
    "A crow perched freely near a caregiver's open hand in a shelter garden",
  ),
  article(
    "Does a Dog's Gender Decide How Loving They Will Be?",
    "dog-gender-and-affection",
    "Affection and suitability cannot be reduced to a dog's gender.",
    "Education",
    "/images/blog/dog-gender-and-affection.png",
    "Two community dogs receiving equal affection from a caregiver",
  ),
  article(
    "Three Motherless Puppies and the Responsibility We All Share",
    "three-motherless-puppies",
    "Vulnerable puppies need more than sympathy; they need shared responsibility.",
    "Animal Welfare",
    "/images/blog/three-motherless-puppies.png",
    "Three young puppies resting together while a caregiver prepares a feeding bottle",
  ),
  article(
    "A Lifetime of Loyalty for One Act of Kindness",
    "lifetime-of-loyalty",
    "A single compassionate act can begin a lifelong bond.",
    "Story",
    "/images/blog/lifetime-of-loyalty.png",
    "A rescued dog walking closely beside a trusted caregiver in Kathmandu",
  ),
  article(
    "Transforming Fear Into Trust: Mama Kali",
    "mama-kali",
    "Patience and consistency helped fear slowly become trust.",
    "Story",
    "/images/blog/mama-kali.png",
    "A shy mother dog cautiously accepting food from a calm caregiver",
  ),
  article(
    "From Caged to Freedom: Chunti and Nakali",
    "chunti-and-nakali",
    "A story of recovery, freedom and learning to feel safe.",
    "Story",
    "/images/blog/chunti-and-nakali.png",
    "Two shelter dogs stepping together through an open kennel door",
  ),
];

export const faqs = [
  [
    "Do you take dogs into the shelter?",
    "Shelter space and care capacity are limited. Please contact Oxsa Nepal before bringing an animal so the team can explain what help is currently possible.",
  ],
  [
    "Do you do rescues?",
    "Rescue capability can change with staffing, space and funding. Call Oxsa Nepal for current guidance; do not assume an immediate rescue response is available.",
  ],
  [
    "Where can my dog stay while I travel?",
    "Oxsa Nepal is not presented as a boarding service. Ask a trusted caregiver or a verified boarding provider and check the environment in person.",
  ],
  [
    "How can I help a sick or injured street dog?",
    "Keep yourself and the animal safe, approach calmly, contact a veterinary clinic and ask local animal-welfare groups for current assistance. Avoid giving human medicine.",
  ],
  [
    "How can I feed local dogs affordably?",
    "Offer clean water and nutritionally suitable food in a safe place away from traffic, then clean the area. Consistency and community cooperation help.",
  ],
  [
    "How do I find a home for an animal?",
    "Use clear photos and honest information, ask trusted networks to share, and screen every interested home carefully.",
  ],
  [
    "How do I screen adopters?",
    "Ask about household agreement, housing permission, previous pets, daily care, travel plans, veterinary costs and the adopter's long-term commitment.",
  ],
  [
    "Are biscuits suitable for dogs?",
    "Biscuits are not a complete diet and some ingredients can be unsuitable. Choose balanced dog-safe food and ask a veterinarian about individual dietary needs.",
  ],
  [
    "How can I adopt an animal?",
    "Review the available listings, complete the adoption application and be ready to discuss your home, experience and lifelong care plan.",
  ],
] as const;

export { vets, vetDirectoryUpdated, type VetCentre } from "./vets";

export const wishlist = {
  "Care & Wellness": [
    "Blankets and towels",
    "Dog beds",
    "Leashes and collars",
    "Food and water bowls",
    "Grooming supplies",
  ],
  Cleaning: [
    "Floor cleaner",
    "Disinfectant",
    "Laundry detergent",
    "Brooms and brushes",
    "Waste bags",
  ],
  Food: ["Dog food", "Cat food", "Rice", "Eggs", "Feeding bowls"],
  Medical: [
    "First-aid supplies",
    "Bandages and gauze",
    "Tick and flea treatment",
    "Veterinary medicines (please confirm first)",
    "Disposable gloves",
  ],
} as const;

export const media = [
  {
    publication: "Herne Katha",
    title: "Oxsa Nepal feature",
    url: "https://www.youtube.com/watch?v=2QZAUVMkKg8&t=1749s",
  },
  {
    publication: "The Annapurna Express",
    title: "Raina Byanjankar: All in for animal welfare",
    url: "https://theannapurnaexpress.com/story/46777/",
  },
  {
    publication: "Edusanjal",
    title:
      "Oxsa Nepal: An Organization for Those Who Can't Speak for Themselves",
    url: "https://edusanjal.com/post/oxsa-nepal-an-organization-for-those-who-cant-speak-for-themselves/",
  },
] as const;

export const adoptions = [
  {
    name: "Punti",
    gender: "",
    age: "",
    location: "Lalitpur",
    status: "verification-needed",
    description: "Archived listing; current availability must be confirmed.",
  },
  {
    name: "Loco",
    gender: "",
    age: "",
    location: "Lalitpur",
    status: "verification-needed",
    description: "Archived listing; current availability must be confirmed.",
  },
  {
    name: "Rocky",
    gender: "",
    age: "",
    location: "Lalitpur",
    status: "verification-needed",
    description: "Archived listing; current availability must be confirmed.",
  },
] as const;
