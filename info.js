const EXPERIENCE = [
  {
    "company": "Atoms",
    "title": "Software Engineering Intern",
    "date": "September 2026 – Present",
    "location": "Seattle, WA",
    "slug": "atoms",
    "summary": "Automating data collection for business insights.",
    "bullets": [
      "Developing an automated web-scraping pipeline that aggregates data from multiple sources for business insights."
    ],
    "link": "/experience/atoms.html",
    "image": "/images/atoms.png",
    "website": "https://atoms.co/"
  },
  {
    "company": "ZipRecruiter",
    "title": "Software Engineering Intern, Applicant Engagement",
    "date": "June 2026 – September 2026",
    "location": "Santa Monica, CA",
    "slug": "ziprecruiter",
    "summary": "Bringing job application context into conversations at scale.",
    "bullets": [
      "Designed and shipped a full-stack feature anchoring each message thread to a primary job application. This backend concept now supports adjacent features and analytics on a two-sided platform handling approximately 70,000 messages per day.",
      "Built an in-context view of applied roles, replacing a redirect to an external job posting site. The feature serves approximately 8,000 weekly interactions.",
      "Owned the gated rollout, implementing server-side feature gates and ramping to 100% of users with no regressions. Partnered with a data science team on dedicated analytics and observability plans."
    ],
    "link": "/experience/ziprecruiter.html",
    "image": "/images/ziprecruiter.png",
    "website": "https://www.ziprecruiter.com/"
  },
  {
    "company": "Electric Era",
    "title": "Software Engineering Intern",
    "date": "April – June 2026 · April – September 2025",
    "location": "Seattle, WA",
    "slug": "electricera",
    "image": "/images/electric_era.jpeg",
    "summary": "Built production software across cloud services, embedded charger systems, driver-facing interfaces, and charging operations.",
    "bullets": [
      "Built dynamic thermal controls for a control enclosure and refactored a legacy Go network management service into C++, reducing CPU use by approximately 30% while improving recovery from network faults.",
      "Built a customer-facing troubleshooting flow that parsed charger diagnostic data and generated guided recovery steps tailored to the detected failure state.",
      "Continued ownership of the OCPI platform, refactoring production services and completing two third-party integrations."
    ],
    "earlier": [
      "Designed, implemented, and owned an Open Charge Point Interface (OCPI 2.2.1) interoperability platform in NestJS and TypeORM. It synchronized site information, live charger status, and charging-session data from more than 100 EV chargers with external e-Mobility Service Providers (eMSPs).",
      "Built caching, diffing, and alerting logic around automated synchronization to track changes and support data integrity across third-party integrations.",
      "Built end-to-end remote start and stop flows connecting eMSPs, cloud services, and charger hardware. The integration provided real-time status feedback and supported reliable charging-session control during intermittent internet connectivity.",
      "Engineered three C++ over-the-air firmware update pipelines across charger boards using serial, Modbus, and FTP interfaces. Update validation and rollback support helped make field updates reliable; the pipelines were deployed across the charging fleet and reduced maintenance overhead.",
      "Engineered an RFID payment flow across physical payment terminals, charger hardware, and backend services. Cloud authorization enabled drivers to initiate charging sessions with RFID cards, adding a new payment method.",
      "Built a charger outage classification tool for the operations team, streamlining root-cause tracking and supporting compliance processes related to National Electric Vehicle Infrastructure (NEVI) funding eligibility."
    ],
    "link": "/experience/electricera.html",
    "website": "https://electricera.tech/"
  },
  {
    "company": "University of Washington",
    "title": "Undergraduate Student Researcher",
    "date": "March – June 2025",
    "location": "Seattle, WA",
    "slug": "uwresearch",
    "image": "/images/uw_logo.jpg",
    "summary": "Explored how students could prove their eligibility for a university community without handing over their personal identifiers.",
    "bullets": [
      "At the Paul G. Allen School of Computer Science & Engineering, developed a privacy-preserving verification flow for University of Washington students in Go, using the Origo framework, zero-knowledge proofs, and TLS oracles.",
      "Applied that flow to a student-only UW discussion forum. The verification step established eligibility for the community without storing or exposing personal identifiers, keeping identity verification separate from participation in discussions."
    ],
    "link": "/experience/uwresearch.html"
  }
];

const PROJECTS = [
  {
    "name": "Fault-Tolerant Distributed Key-Value Store",
    "tag": "Distributed systems",
    "stack": "Java · Multi-Paxos · Two-phase commit",
    "description": "Built a linearizable, fault-tolerant sharded key-value store using Multi-Paxos, with log compaction and transactions implemented through two-phase commit and locking.",
    "details": [
      "The store combines sharding with Multi-Paxos replication, bringing together data partitioning and consensus in a single distributed system. Its linearizable interface makes operations appear to take effect in a consistent order that respects real-time ordering.",
      "Implemented log compaction to manage the growth of replicated history, and added transactions using two-phase commit and locking. These features extend the core replicated store with coordination for transactional updates."
    ]
  },
  {
    "name": "Appearance-Based Bias in Visual Representations",
    "tag": "Machine learning research",
    "stack": "Computer vision · NLP · VQ-VAE-2 · ResNet-50",
    "description": "Built an end-to-end computer vision and NLP pipeline across approximately 500 public figures using aligned face crops and Reddit sentiment data. Evaluation across 349 identities found that standalone demographic attributes outperformed learned appearance features, indicating that the apparent predictive signal largely reflected demographic bias.",
    "details": [
      "Combined computer vision and natural language processing in an end-to-end pipeline: aligned face crops supplied visual inputs, while Reddit sentiment data provided the language-based signal for studying public perceptions.",
      "The dataset covered approximately 500 public figures, with evaluation on 349 identities. Compared VQ-VAE-2 and ResNet-50 appearance features with standalone demographic attributes.",
      "Demographic attributes performed better than the learned appearance features. This result suggested that the apparent predictive signal largely reflected demographic bias, an important limitation when interpreting the relationship between appearance and sentiment."
    ]
  },
  {
    "name": "Stills",
    "year": "2024",
    "link": "https://devpost.com/software/stills",
    "description": "A wellness-focused cross-platform mobile application focused on inspiring users with daily photographic prompts.",
    "stack": "Flutter · Hive · AES encryption · Flutter Secure Storage",
    "repository": "https://github.com/dhvbnl/dubhacks_2024",
    "details": [
      "Built a cross-platform Flutter application for Android and iOS that encouraged creativity and mindfulness through daily photographic prompts.",
      "Integrated the device camera and local file storage using Flutter’s camera and path_provider plugins, letting users capture photos in the app in response to each prompt.",
      "Implemented local data storage with Hive and AES encryption, together with Flutter Secure Storage. The design kept user data on the device and incorporated encryption into the storage workflow."
    ]
  },
  {
    "name": "UMix",
    "year": "2023",
    "link": "https://devpost.com/software/umix",
    "description": "Built an AI browser extension that let users make real-time HTML and CSS changes to a webpage.",
    "stack": "JavaScript · Node.js · GPT-4 · Browser DOM",
    "repository": "https://github.com/pranavnt/umix",
    "details": [
      "Implemented the JavaScript frontend for an AI-assisted browser extension, applying backend-generated changes directly to the page’s in-memory DOM.",
      "Collaborated with backend developers to integrate a Node.js server powered by GPT-4. The frontend consumed API responses and translated them into live HTML and CSS updates in the browser."
    ]
  },
  {
    "name": "Defused",
    "year": "2022",
    "link": "https://keshavach.wixsite.com/portfolio/defused",
    "description": "A 2D platformer built in Godot about a bomb that doesn't want to explode."
  }
];
