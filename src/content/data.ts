export type Animal = { name: string; slug: string; species: "Dog" | "Cat"; excerpt: string; story: string[] };

const dogNames = ["Puku", "Candy", "Dony", "Chunti", "Sumnima", "Seti", "Tinu", "Kanthuli Musi", "Baby", "Sana", "Tiku", "Pinky", "Seru", "Sam", "Nakali"];
const catNames = ["Bhattu", "Ginju"];

const profiles: Record<string, { excerpt: string; story: string[] }> = {
  Puku: { excerpt: "Sweet, mischievous and always ready for a tiny adventure.", story: ["Puku arrived at the shelter gate when he was a small puppy after roaming near the Thapathali Pool. Although many male puppies find homes, Puku stayed and grew up with OXSA Nepal.", "He enjoys watching the road and occasionally slips through an open door, only to return from his little adventure a few minutes later. Sponsorship helps provide the steady food, shelter and care he depends on."] },
  Candy: { excerpt: "A gentle shelter resident who values calm company.", story: ["Candy is one of the animals who depends on OXSA Nepal for daily food, safety and care.", "Monthly sponsorship helps make that care dependable and gives the shelter a steadier foundation for planning."] },
  Dony: { excerpt: "A much-loved member of the OXSA shelter family.", story: ["Dony lives in OXSA Nepal's care and is part of its monthly sponsorship programme.", "A sponsor can contribute to his everyday food, shelter and access to medical support when it is needed."] },
  Chunti: { excerpt: "Learning that safety can feel like freedom.", story: ["Chunti's journey is connected with recovery from life in a cage and the patient work of rebuilding trust.", "Sponsorship supports the calm routines and consistent care on which that trust depends."] },
  Tinu: { excerpt: "The shelter's watchful and affectionate guardian.", story: ["Tinu is remembered in OXSA Nepal's writing as the shelter's adorable guardian.", "Monthly support helps provide the everyday care that keeps Tinu safe at the shelter."] },
  Nakali: { excerpt: "A resilient animal whose trust grew with patient care.", story: ["Nakali's story is connected with Chunti's journey from confinement toward freedom and care.", "Sponsorship helps sustain the patient, consistent care behind that recovery."] },
};

export const animals: Animal[] = [...dogNames.map((name) => ({
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  species: "Dog" as const,
  excerpt: profiles[name]?.excerpt ?? "A shelter resident with an individual story and a need for steady care.",
  story: profiles[name]?.story ?? [
    `${name} is one of the animals living in OXSA Nepal's care and is included in the monthly sponsorship programme.`,
    "Monthly sponsorship helps OXSA Nepal provide consistent food, shelter and care.",
  ],
})), ...catNames.map((name) => ({
  name,
  slug: name.toLowerCase(),
  species: "Cat" as const,
  excerpt: "A feline shelter resident who can be supported from afar.",
  story: [`${name} is one of the cats living in OXSA Nepal's care.`, "Monthly sponsorship helps OXSA Nepal provide consistent food, shelter and care."],
}))];

export const work = [
  { id: "spaying", icon: "✚", title: "Spaying & Neutering", short: "Humane population management prevents future litters from being born into hunger, illness and danger.", body: "Spaying and neutering is one of the most responsible ways to reduce long-term suffering. OXSA Nepal supports humane population management so fewer animals are born into unsafe conditions." },
  { id: "adoption", icon: "⌂", title: "Adoption", short: "Careful matching helps animals find safe, permanent and responsible homes.", body: "Adoption is a lifelong promise. OXSA Nepal screens prospective homes because a good match protects both the animal and the family welcoming them." },
  { id: "feeding", icon: "◒", title: "Daily Feeding", short: "Regular meals relieve hunger and help build trust with community animals.", body: "Street animals face hunger every day. Regular feeding gives immediate relief and creates the trust needed to notice illness, support vaccination and offer further care." },
  { id: "vaccination", icon: "✦", title: "Vaccination", short: "Vaccination protects animals and communities from preventable disease.", body: "OXSA Nepal supports vaccination work against serious diseases including rabies and distemper. Prevention protects individual animals and the wider community." },
  { id: "awareness", icon: "◎", title: "Awareness", short: "Education turns everyday choices into a more compassionate community.", body: "Lasting change depends on how people understand and respond to animals. OXSA Nepal shares practical guidance and encourages community responsibility." },
] as const;

export type Article = { title: string; slug: string; excerpt: string; date?: string; category?: string; paragraphs: string[]; published?: boolean };
const article = (title: string, slug: string, excerpt: string, category = "Story"): Article => ({
  title, slug, excerpt, category, published: true,
  paragraphs: [excerpt, "OXSA Nepal shares this account to encourage patient, practical compassion and a stronger sense of responsibility toward animals in our communities."],
});

export const stories: Article[] = [
  article("How Kalu Fought Nasal Cancer", "how-kalu-fought-nasal-cancer", "Kalu's story is about illness, treatment and the determination to keep caring."),
  article("Saving a Hit-and-Run Puppy", "saving-a-hit-and-run-puppy", "A reminder that quick, compassionate action can give an injured puppy a chance."),
  article("Love Has No Looks: The Story of Timar Kancha", "love-has-no-looks", "Timar Kancha's story asks us to see worth beyond appearance."),
  article("Not Every Cat Is a Natural-Born Hunter", "not-every-cat-is-a-natural-born-hunter", "A compassionate look at the assumptions people make about cats and survival."),
  article("Please Check Under Your Vehicle Before Driving", "check-under-your-vehicle", "A simple safety habit can prevent terrible injuries to resting street animals."),
  article("The Journey of the Three Kalus", "journey-of-the-three-kalus", "Three animals, one shared name and a journey toward safety."),
  article("How Two Puppies Chose to Leave the Street", "two-puppies-left-the-street", "A story about trust, choice and the promise of a safer life."),
  article("A Man With a Golden Heart", "a-man-with-a-golden-heart", "One person's kindness shows the difference an ordinary neighbour can make."),
  article("Remembering Tyau – A Rescued Cat", "remembering-tyau", "A loving remembrance of Tyau and the life made possible through rescue."),
  article("A Story of Overcoming Superstition", "overcoming-superstition", "Compassion grows when fear and superstition give way to understanding."),
  article("The Story of Pappan – A Crow", "pappan-the-crow", "Pappan's story widens the circle of care beyond dogs and cats."),
];

export const blog: Article[] = [
  article("Why Every Dog Should Wear an ID Tag", "why-every-dog-needs-an-id-tag", "An ID tag is a small step that can help a lost dog return home.", "Education"),
  article("From the Streets of Nepal to a Loving Home in Canada", "streets-of-nepal-to-canada", "A journey from street life in Nepal to a permanent family abroad.", "Animal Welfare"),
  article("Our Shelter's Adorable Guardian: Tinu", "shelter-guardian-tinu", "Meet Tinu, a familiar and watchful presence at the shelter.", "Story"),
  article("The Heartbreaking Reality Behind Irresponsible Breeding", "irresponsible-breeding", "Why breeding decisions must put animal welfare before convenience or profit.", "Education"),
  article("A Tale of Trust and Freedom: Pappan the Crow", "pappan-trust-and-freedom", "Pappan's relationship with people became a lesson in trust and freedom.", "Story"),
  article("Does a Dog's Gender Decide How Loving They Will Be?", "dog-gender-and-affection", "Affection and suitability cannot be reduced to a dog's gender.", "Education"),
  article("Three Motherless Puppies and the Responsibility We All Share", "three-motherless-puppies", "Vulnerable puppies need more than sympathy; they need shared responsibility.", "Animal Welfare"),
  article("A Lifetime of Loyalty for One Act of Kindness", "lifetime-of-loyalty", "A single compassionate act can begin a lifelong bond.", "Story"),
  article("Transforming Fear Into Trust: Mama Kali", "mama-kali", "Patience and consistency helped fear slowly become trust.", "Story"),
  article("From Caged to Freedom: Chunti and Nakali", "chunti-and-nakali", "A story of recovery, freedom and learning to feel safe.", "Story"),
];

export const faqs = [
  ["Do you take dogs into the shelter?", "Shelter space and care capacity are limited. Please contact OXSA Nepal before bringing an animal so the team can explain what help is currently possible."],
  ["Do you do rescues?", "Rescue capability can change with staffing, space and funding. Call OXSA Nepal for current guidance; do not assume an immediate rescue response is available."],
  ["Where can my dog stay while I travel?", "OXSA Nepal is not presented as a boarding service. Ask a trusted caregiver or a verified boarding provider and check the environment in person."],
  ["How can I help a sick or injured street dog?", "Keep yourself and the animal safe, approach calmly, contact a veterinary clinic and ask local animal-welfare groups for current assistance. Avoid giving human medicine."],
  ["How can I feed local dogs affordably?", "Offer clean water and nutritionally suitable food in a safe place away from traffic, then clean the area. Consistency and community cooperation help."],
  ["How do I find a home for an animal?", "Use clear photos and honest information, ask trusted networks to share, and screen every interested home carefully."],
  ["How do I screen adopters?", "Ask about household agreement, housing permission, previous pets, daily care, travel plans, veterinary costs and the adopter's long-term commitment."],
  ["Are biscuits suitable for dogs?", "Biscuits are not a complete diet and some ingredients can be unsuitable. Choose balanced dog-safe food and ask a veterinarian about individual dietary needs."],
  ["How can I adopt an animal?", "Review the available listings, complete the adoption application and be ready to discuss your home, experience and lifelong care plan."],
] as const;

export const vets = [
  ["City Veterinary Hospital", "Lalitpur", "Satdobato", "9801017334"],
  ["Jibachha Veterinary Hospital", "Lalitpur", "Jhamsikhel", "01-5450013"],
  ["Patan Veterinary Clinic", "Lalitpur", "Patan", "01-5442733"],
  ["Animal Care Centre (Veterinary Clinic)", "Kathmandu", "Chabahil", "9851224131"],
  ["Kathmandu Veterinary Clinic", "Kathmandu", "Chakrapath", "01-4720266"],
  ["Central Referral Animal Hospital", "Kathmandu", "Tripureshwor", "01-5329064"],
  ["Vet For Your Pet – the Animals' Clinic", "Bhaktapur", "Suryabinayak", "01-6613244"],
  ["Pacific Vet Clinic", "Bhaktapur", "Madhyapur Thimi", "9841080258"],
  ["Sunshine Veterinary Centre", "Pokhara", "Pokhara", "9856035513"],
  ["Veterinary Hospital and Livestock Service Expert Center", "Pokhara", "Pokhara", "061-520082"],
  ["Metro Vet Clinic Pvt Ltd", "Bharatpur", "Bharatpur", "9851054224"],
  ["Chitwan Lumbini Kennal Club & Pet Vet Clinic", "Bharatpur", "Bharatpur", "9845050944"],
  ["Birgunj Vet Pharma", "Birgunj", "Birgunj", "051-522523"],
  ["Birgunj Pet Clinic", "Birgunj", "Birgunj", "9845262670"],
] as const;

export const wishlist = {
  "Care & Wellness": ["Blankets and towels", "Dog beds", "Leashes and collars", "Food and water bowls", "Grooming supplies"],
  Cleaning: ["Floor cleaner", "Disinfectant", "Laundry detergent", "Brooms and brushes", "Waste bags"],
  Food: ["Dog food", "Cat food", "Rice", "Eggs", "Feeding bowls"],
  Medical: ["First-aid supplies", "Bandages and gauze", "Tick and flea treatment", "Veterinary medicines (please confirm first)", "Disposable gloves"],
} as const;

export const media = [
  { publication: "Herne Katha", title: "OXSA Nepal feature", url: "https://www.youtube.com/results?search_query=Herne+Katha+OXSA+Nepal" },
  { publication: "The Annapurna Express", title: "Raina Byanjankar: All in for animal welfare", url: "https://theannapurnaexpress.com/story/46777/" },
  { publication: "Edusanjal", title: "Oxsa Nepal: An Organization for Those Who Can't Speak for Themselves", url: "https://edusanjal.com/post/oxsa-nepal-an-organization-for-those-who-cant-speak-for-themselves/" },
] as const;

export const adoptions = [
  { name: "Punti", gender: "", age: "", location: "Lalitpur", status: "verification-needed", description: "Archived listing; current availability must be confirmed." },
  { name: "Loco", gender: "", age: "", location: "Lalitpur", status: "verification-needed", description: "Archived listing; current availability must be confirmed." },
  { name: "Rocky", gender: "", age: "", location: "Lalitpur", status: "verification-needed", description: "Archived listing; current availability must be confirmed." },
] as const;
