import type { Contact } from "@types/contact";
import { daysAgo, weeksAgo, monthsAgo } from "./contact-helpers";

/**
 * Investor Contacts (12)
 * VCs, angels, board members
 */
export const investorContacts: Contact[] = [
  {
    id: "inv-1",
    firstName: "Jonathan",
    lastName: "Chen",
    avatarUrl: "/avatars/1725943074093.jpeg",
    company: "Andreessen Horowitz",
    title: "General Partner",
    department: "Growth Fund",
    email: "jchen@a16z.com",
    phone: "+1 (650) 555-0101",
    linkedIn: "linkedin.com/in/jonathanchen",
    twitter: "@jchen_a16z",
    timezone: "America/Los_Angeles",
    location: "Menlo Park, CA",
    category: "investor",

    relationship: "champion",
    relationshipScore: 94,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["investor", "A16Z", "Sentra"],

    insights: {
      aiSummary:
        "Jon led our Series A and has been my go-to for enterprise intros. He checks in every week on product updates and has been pushing hard to help with our Series B fundraise. Genuinely one of the most supportive investors I've worked with — treats our wins like his own.",
      strengths: [
        "Weekly office hours available",
        "Deep enterprise GTM experience",
        "Strong founder network",
      ],
      risks: ["High expectations for growth metrics"],
      talkingPoints: [
        "Jon was on the a16z podcast last week talking about founder-market fit in vertical SaaS",
        "He's been tweeting about context graphs and AI infrastructure — might tie into our roadmap",
        "Mentioned he's advising a new developer tools company out of stealth",
      ],
      interests: ["AI/ML", "Developer tools", "Enterprise SaaS"],
      bestReachTime: "Responsive on text, prefers quick calls",
      insightsUpdatedAt: daysAgo(1),
      companyNews: [
        {
          id: "news-a16z-1",
          headline: "Andreessen Horowitz raises $7.2B across new fund vehicles",
          date: daysAgo(6),
          sourceUrl: "https://a16z.com/news",
          category: "funding",
        },
        {
          id: "news-a16z-2",
          headline:
            "a16z launches new AI-focused growth fund targeting enterprise startups",
          date: daysAgo(14),
          sourceUrl: "https://a16z.com/blog",
          category: "product",
        },
        {
          id: "news-a16z-3",
          headline:
            "Marc Andreessen publishes manifesto on American dynamism and tech investment",
          date: daysAgo(22),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Led our Series A, always makes time for us even on short notice\n- His enterprise network has been incredibly valuable — three of our top deals came from his intros\n- Prefers quick calls over long emails, text him for anything urgent",
      quickFacts: [
        "Ex-Google PM Director",
        "Stanford MBA",
        "3x founder himself",
      ],
      personalDetails: "Big Warriors fan. Two daughters. Runs marathons.",
      notesUpdatedAt: daysAgo(3),
    },

    interestingFacts: [
      {
        id: "fact-inv1-1",
        content:
          "Huge Warriors fan — has season tickets and takes his daughters to every home game",
        source: "Meeting - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "hobby",
      },
      {
        id: "fact-inv1-2",
        content:
          "His older daughter just started learning piano and he's been sending me practice videos",
        source: "Lunch - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "family",
      },
      {
        id: "fact-inv1-3",
        content:
          "Just got a golden retriever puppy named Scout back in November — shows photos at every meeting",
        source: "Slack - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Q1 Planning", "Enterprise Pipeline", "Series B Timing"],

    interactions: [
      {
        id: "int-inv1-1",
        type: "meeting",
        date: daysAgo(2),
        subject: "Monthly Investor Update",
        summary: "Walked through metrics. He's pushing us to hire faster.",
        sentiment: "positive",
        keyTopics: ["Metrics", "Hiring", "Growth"],
      },
    ],

    lastContacted: daysAgo(2),
    nextFollowUp: daysAgo(-5),
    firstContact: monthsAgo(8),
    createdAt: monthsAgo(8),
    updatedAt: daysAgo(2),
  },

  {
    id: "inv-2",
    firstName: "Sarah",
    lastName: "Kim",
    avatarUrl: "/avatars/1517664582201.jpeg",
    company: "Sequoia Capital",
    title: "Partner",
    department: "US Fund",
    email: "skim@sequoiacap.com",
    phone: "+1 (650) 555-1102",
    linkedIn: "linkedin.com/in/sarahkim",
    timezone: "America/Los_Angeles",
    location: "Menlo Park, CA",
    category: "investor",

    relationship: "decision_maker",
    relationshipScore: 78,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["investor", "Sequoia"],

    insights: {
      aiSummary:
        "Sarah's been tracking us since our seed round and she's our top Series B prospect. She's incredibly data-driven — I need to come prepared with granular metrics every time we meet. If we can nail the Q1 numbers, she could be our Series B lead. Our conversations have been formal but she's warming up.",
      strengths: [
        "Deep category expertise",
        "$500M fund to deploy",
        "Excellent portfolio support",
      ],
      risks: ["Competitive deal process", "High bar for unit economics"],
      talkingPoints: [
        "Sarah published a piece on Sequoia's blog last week about AI unit economics and the 'Rule of 40' for AI-native companies",
        "She led a growth round in Notion last month — clearly bullish on productivity tools",
      ],
      interests: ["Unit economics", "Retention curves", "Market sizing"],
      bestReachTime: "Email preferred, responds within 24 hours",
      insightsUpdatedAt: daysAgo(5),
      companyNews: [
        {
          id: "news-seq-1",
          headline:
            "Sequoia Capital splits into three independent firms across regions",
          date: daysAgo(8),
          sourceUrl: "https://sequoiacap.com/article",
          category: "leadership",
        },
        {
          id: "news-seq-2",
          headline: "Sequoia leads $200M growth round in enterprise AI startup",
          date: daysAgo(18),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Extremely sharp on unit economics — come prepared with granular cohort data every time\n- Waiting on our Q1 numbers before committing to a deep dive\n- Worth the effort, Sequoia's brand and portfolio support are unmatched",
      quickFacts: ["Ex-McKinsey", "Harvard MBA", "Board member at Notion"],
      personalDetails: "Avid reader. Recommends business books constantly.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-inv2-1",
        content:
          "Runs a book club with other VCs — currently reading science fiction, just finished Project Hail Mary",
        source: "Lunch - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv2-2",
        content:
          "Her son started kindergarten this fall and she's been adjusting to the school drop-off routine",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "family",
      },
    ],

    recentTopics: ["Unit Economics", "Series B Timeline", "Market Analysis"],

    interactions: [
      {
        id: "int-inv2-1",
        type: "meeting",
        date: weeksAgo(1),
        subject: "Series B Introduction",
        summary:
          "Initial meeting went well. She wants to see Q1 numbers before deep dive.",
        sentiment: "positive",
        keyTopics: ["Series B", "Metrics", "Timeline"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-14),
    firstContact: monthsAgo(6),
    createdAt: monthsAgo(6),
    updatedAt: weeksAgo(1),
  },

  {
    id: "inv-3",
    firstName: "Michael",
    lastName: "Rivera",
    avatarUrl: "/avatars/1578500070988.jpeg",
    company: "Benchmark",
    title: "General Partner",
    department: "Early Stage",
    email: "mrivera@benchmark.com",
    phone: "+1 (415) 555-1203",
    linkedIn: "linkedin.com/in/michaelrivera",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "investor",

    relationship: "influencer",
    relationshipScore: 65,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["investor", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Mike was our first believer — wrote the seed check in 48 hours without even seeing a deck. We catch up quarterly and he's a great sounding board for big strategic questions. Not as operationally involved as Jon, but when I need a gut-check on direction, he's the first person I call.",
      strengths: [
        "Long-term perspective",
        "Founder-friendly",
        "Great judgment",
      ],
      risks: ["Less hands-on support"],
      talkingPoints: [
        "Gave a talk at Benchmark's annual CEO summit on building durable companies in AI",
        "He's been quietly advising a couple of climate tech startups — mentioned it on a recent podcast",
      ],
      interests: ["Long-term vision", "Team culture", "Market dynamics"],
      bestReachTime: "Quarterly catch-ups work best",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-bench-1",
          headline:
            "Benchmark leads seed round in stealth AI infrastructure company",
          date: daysAgo(10),
          sourceUrl: "https://techcrunch.com",
          category: "funding",
        },
        {
          id: "news-bench-2",
          headline:
            "Benchmark partner Bill Gurley gives keynote on venture returns at All-In Summit",
          date: daysAgo(20),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Our first believer, wrote the seed check before we even had a deck\n- Best used as a strategic sounding board — quarterly catch-ups work well\n- Values the relationship over metrics, just keep him in the loop on big moves",
      quickFacts: ["Founded 2 unicorns", "Known for founder backing"],
      personalDetails: "Wine collector. Napa trips.",
      notesUpdatedAt: monthsAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-inv3-1",
        content:
          "Serious wine collector — just got a case of 2018 Screaming Eagle, wouldn't stop talking about it",
        source: "Call - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-inv3-2",
        content:
          "Does an annual Napa trip with his wife every October — they hit Opus One and French Laundry this year",
        source: "Meeting - Oct 2025",
        extractedAt: monthsAgo(4),
        category: "travel",
      },
    ],

    recentTopics: ["Long-term Strategy", "Team Building"],

    interactions: [
      {
        id: "int-inv3-1",
        type: "call",
        date: weeksAgo(3),
        subject: "Quarterly Catch-up",
        summary:
          "Good conversation about long-term vision. Offered to help with hiring.",
        sentiment: "positive",
        keyTopics: ["Vision", "Hiring"],
      },
    ],

    lastContacted: weeksAgo(3),
    nextFollowUp: daysAgo(-21),
    firstContact: monthsAgo(14),
    createdAt: monthsAgo(14),
    updatedAt: weeksAgo(3),
  },

  {
    id: "inv-4",
    firstName: "Lisa",
    lastName: "Wang",
    avatarUrl: "/avatars/1636597139460.jpeg",
    company: "Greylock Partners",
    title: "Partner",
    department: "Enterprise",
    email: "lwang@greylock.com",
    phone: "+1 (650) 555-1304",
    linkedIn: "linkedin.com/in/lisawang",
    timezone: "America/Los_Angeles",
    location: "Menlo Park, CA",
    category: "investor",

    relationship: "contact",
    relationshipScore: 55,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["investor", "Glean"],

    insights: {
      aiSummary:
        "I met Lisa at a Greylock enterprise event a few months ago and she seemed genuinely interested, but she's been hard to pin down since. We've only exchanged a couple emails. She knows the enterprise space cold though, and if we can show her real traction with our latest deals, I think she'd lean in. Need to get a proper meeting on the books.",
      strengths: ["Enterprise expertise", "Large fund"],
      risks: ["Hasn't committed time yet"],
      talkingPoints: [
        "Lisa moderated a panel at Enterprise Connect on AI in the enterprise last month",
        "She tweeted about the 'consumerization of enterprise UX' and it got a lot of engagement",
      ],
      interests: ["Enterprise sales", "Product-market fit"],
      bestReachTime: "Email only",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-grey-1",
          headline:
            "Greylock Partners closes $1B fund focused on AI and enterprise software",
          date: daysAgo(7),
          sourceUrl: "https://greylock.com/news",
          category: "funding",
        },
        {
          id: "news-grey-2",
          headline:
            "Greylock hosts inaugural Enterprise Connect summit for portfolio founders",
          date: daysAgo(16),
          category: "general",
        },
        {
          id: "news-grey-3",
          headline:
            "Partner Reid Hoffman steps back from active investing to focus on AI research",
          date: daysAgo(25),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Met at a Greylock enterprise event, interested but hasn't committed real time yet\n- Need to get a proper meeting scheduled — send her our latest enterprise case studies\n- Email only, don't try to call or text",
      quickFacts: ["Ex-Box executive", "Focus on enterprise infra"],
      personalDetails: "Triathlete.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-inv4-1",
        content:
          "Training for the Escape from Alcatraz triathlon in June — she mentioned swimming in the Bay every weekend",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv4-2",
        content:
          "Just moved to a new place in Menlo Park with her partner and adopted a rescue cat named Pixel",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "general",
      },
    ],

    recentTopics: ["Enterprise Motion", "Series B"],

    interactions: [
      {
        id: "int-inv4-1",
        type: "email",
        date: weeksAgo(2),
        subject: "Following Up",
        summary: "Sent update on enterprise wins. Waiting for response.",
        sentiment: "neutral",
        keyTopics: ["Enterprise", "Follow-up"],
      },
    ],

    lastContacted: weeksAgo(2),
    nextFollowUp: daysAgo(-7),
    firstContact: monthsAgo(3),
    createdAt: monthsAgo(3),
    updatedAt: weeksAgo(2),
  },

  {
    id: "inv-5",
    firstName: "David",
    lastName: "Park",
    avatarUrl: "/avatars/1746590628117.jpeg",
    company: "Lightspeed Venture Partners",
    title: "Partner",
    department: "Growth",
    email: "dpark@lsvp.com",
    phone: "+1 (650) 555-1405",
    linkedIn: "linkedin.com/in/davidpark",
    timezone: "America/Los_Angeles",
    location: "Menlo Park, CA",
    category: "investor",

    relationship: "decision_maker",
    relationshipScore: 72,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["investor", "Sentra", "A16Z"],

    insights: {
      aiSummary:
        "David has become my most active Series B conversation. He's done extensive diligence on his own, talked to a bunch of our customers, and came back really bullish. I like his energy and he moves fast, but I need to manage his expectations on valuation — he's pushing for a bigger round than we planned. We text almost daily at this point.",
      strengths: ["Fast decision maker", "Founder references strong"],
      risks: ["May push for larger round than planned"],
      talkingPoints: [
        "David did a fireside chat at the Lightspeed CEO Summit on how to build sales teams in AI companies",
        "He invested in a computer vision startup last week and has been posting about 'the next wave of applied AI'",
        "Was on the Twenty Minute VC podcast talking about what he looks for in Series B founders",
      ],
      interests: ["Growth metrics", "Competitive landscape"],
      bestReachTime: "Very responsive to text",
      insightsUpdatedAt: daysAgo(3),
      companyNews: [
        {
          id: "news-lsvp-1",
          headline:
            "Lightspeed Venture Partners closes $4.2B across early and growth-stage funds",
          date: daysAgo(5),
          sourceUrl: "https://lsvp.com/news",
          category: "funding",
        },
        {
          id: "news-lsvp-2",
          headline: "Lightspeed portfolio company Rubrik files for IPO",
          date: daysAgo(15),
          category: "funding",
        },
        {
          id: "news-lsvp-3",
          headline:
            "Lightspeed opens new office in London to expand European presence",
          date: daysAgo(24),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Most aggressive about leading our Series B, moves very fast\n- Need to manage his expectations on valuation and round size — he wants bigger than we planned\n- Super responsive on text, easy to work with day-to-day",
      quickFacts: ["Led 12 Series Bs", "Snap investor"],
      personalDetails: "Big Lakers fan. Dad jokes.",
      notesUpdatedAt: daysAgo(5),
    },

    interestingFacts: [
      {
        id: "fact-inv5-1",
        content:
          "Die-hard Lakers fan — flew his kids to the Christmas Day game and wouldn't stop texting me about it",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-inv5-2",
        content:
          "Always opens meetings with a dad joke — his twin boys are 7 and apparently the source of all his material",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "family",
      },
    ],

    recentTopics: ["Series B Terms", "Round Sizing"],

    interactions: [
      {
        id: "int-inv5-1",
        type: "meeting",
        date: daysAgo(4),
        subject: "Term Sheet Discussion",
        summary: "Reviewing preliminary terms. Numbers look good.",
        sentiment: "positive",
        keyTopics: ["Terms", "Valuation"],
      },
    ],

    lastContacted: daysAgo(4),
    nextFollowUp: daysAgo(-2),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: daysAgo(4),
  },

  {
    id: "inv-6",
    firstName: "Emily",
    lastName: "Zhang",
    avatarUrl: "/avatars/1762280748340.jpeg",
    company: "Index Ventures",
    title: "Principal",
    department: "US Fund",
    email: "ezhang@indexventures.com",
    phone: "+1 (212) 555-1506",
    linkedIn: "linkedin.com/in/emilyzhang",
    timezone: "America/New_York",
    location: "New York, NY",
    category: "investor",

    relationship: "contact",
    relationshipScore: 60,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["investor", "Sequoia", "Glean"],

    insights: {
      aiSummary:
        "Just met Emily at SaaStr last week and we had a great first conversation. She's sharp and clearly excited about the dev tools space, but she's a principal so she'll need to bring in a partner for anything real. I'm going to schedule a deeper product demo and make sure I loop in her GP early. Good early energy but still very new.",
      strengths: ["Fresh perspective", "Strong sourcing network"],
      risks: ["Junior - needs partner buy-in"],
      talkingPoints: [
        "Emily published a thread on X breaking down the economics of open-source vs. closed-source AI tooling",
        "She's been attending a lot of developer conferences — spoke on a panel at DevWorld about PLG in B2B",
      ],
      interests: ["Developer tools", "Open source"],
      bestReachTime: "Email or Twitter DM",
      insightsUpdatedAt: daysAgo(7),
      companyNews: [
        {
          id: "news-index-1",
          headline:
            "Index Ventures raises $2.3B for new growth and early-stage funds",
          date: daysAgo(9),
          sourceUrl: "https://indexventures.com/news",
          category: "funding",
        },
        {
          id: "news-index-2",
          headline: "Index portfolio company Figma completes successful IPO",
          date: daysAgo(19),
          category: "funding",
        },
      ],
    },

    notes: {
      customSummary:
        "- Met at SaaStr, great first conversation but very early\n- She's a principal, so need to loop in her GP for any serious discussion\n- Reach her via email or Twitter DM — schedule the product deep dive soon",
      quickFacts: ["Ex-Stripe PM", "Developer background"],
      personalDetails: "Runs a tech newsletter.",
      notesUpdatedAt: daysAgo(7),
    },

    interestingFacts: [
      {
        id: "fact-inv6-1",
        content:
          "Big into bouldering — she climbs at Brooklyn Boulders a few times a week and just sent her first V6",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "hobby",
      },
      {
        id: "fact-inv6-2",
        content:
          "Recently moved from SF to NYC for the Index role — still figuring out the city and asked for restaurant recs",
        source: "Coffee chat - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "general",
      },
    ],

    recentTopics: ["Product Overview", "Market Opportunity"],

    interactions: [
      {
        id: "int-inv6-1",
        type: "meeting",
        date: daysAgo(7),
        subject: "Intro Meeting",
        summary: "Good chemistry. She wants to schedule a deeper dive.",
        sentiment: "positive",
        keyTopics: ["Introduction", "Product"],
      },
    ],

    lastContacted: daysAgo(7),
    nextFollowUp: daysAgo(-3),
    firstContact: daysAgo(10),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(7),
  },

  {
    id: "inv-7",
    firstName: "Robert",
    lastName: "Thompson",
    avatarUrl: "/avatars/1516158952953.jpeg",
    company: "Accel",
    title: "Partner",
    department: "Growth",
    email: "rthompson@accel.com",
    phone: "+1 (650) 555-1607",
    linkedIn: "linkedin.com/in/robertthompson",
    timezone: "America/Los_Angeles",
    location: "Palo Alto, CA",
    category: "investor",

    relationship: "influencer",
    relationshipScore: 68,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["friend", "A16Z", "Sentra"],

    insights: {
      aiSummary:
        "Robert's firm passed on our round, but he's been incredibly generous with his time anyway. He's made three warm intros to enterprise CXOs in the last two months, and each one turned into a real conversation. We talk every couple weeks — he's become an unofficial advisor. I don't want to over-ask, but his network is genuinely world-class.",
      strengths: ["Enterprise network", "Board experience"],
      risks: ["Time-constrained"],
      talkingPoints: [
        "Robert wrote an Accel blog post last week on 'Why enterprise AI is different this time around'",
        "He just joined the board of a cybersecurity startup — been posting about zero-trust architecture",
        "Gave the closing keynote at SaaStr Annual on building category-defining companies",
      ],
      interests: ["Enterprise GTM", "International expansion"],
      bestReachTime: "Schedule through EA",
      insightsUpdatedAt: weeksAgo(1),
      companyNews: [
        {
          id: "news-accel-1",
          headline:
            "Accel closes $3B global fund targeting enterprise and fintech startups",
          date: daysAgo(4),
          sourceUrl: "https://accel.com/noteworthy",
          category: "funding",
        },
        {
          id: "news-accel-2",
          headline:
            "Accel portfolio company CrowdStrike surpasses $3B in annual revenue",
          date: daysAgo(12),
          category: "general",
        },
        {
          id: "news-accel-3",
          headline:
            "Accel launches new European seed program with dedicated team in London",
          date: daysAgo(21),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Accel passed on our round but Robert has been incredibly helpful with enterprise CXO intros\n- Don't over-ask — he's time-constrained, schedule everything through his EA\n- Keep the relationship warm, his network is the best I've seen in enterprise",
      quickFacts: ["20+ boards", "Slack early investor"],
      personalDetails: "Collects modern art.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-inv7-1",
        content:
          "Serious modern art collector — just acquired a KAWS piece and invited me to see his home gallery in Palo Alto",
        source: "Dinner - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
      {
        id: "fact-inv7-2",
        content:
          "His daughter is a freshman at NYU studying film — he flew out to help her move in last August and got emotional about it",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Enterprise Intros", "Strategy"],

    interactions: [
      {
        id: "int-inv7-1",
        type: "email",
        date: weeksAgo(1),
        subject: "Introduction Request",
        summary: "Made intro to Snowflake CTO. Very helpful.",
        sentiment: "positive",
        keyTopics: ["Introductions"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-14),
    firstContact: monthsAgo(6),
    createdAt: monthsAgo(6),
    updatedAt: weeksAgo(1),
  },

  {
    id: "inv-8",
    firstName: "Jennifer",
    lastName: "Lee",
    avatarUrl: "/avatars/1644337039118.jpeg",
    company: "Founders Fund",
    title: "Partner",
    department: "Growth",
    email: "jlee@foundersfund.com",
    phone: "+1 (415) 555-1708",
    linkedIn: "linkedin.com/in/jenniferlee",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "investor",

    relationship: "contact",
    relationshipScore: 50,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["investor", "Sequoia"],

    insights: {
      aiSummary:
        "Jennifer and I have only had a couple real conversations but she's intriguing. Founders Fund swings big and she seems like she's evaluating the whole AI tooling space, not just us. I sent her our long-term vision deck and I'm waiting to hear back. She thinks differently from most VCs — very contrarian — so I need to pitch the 10-year version, not the quarterly metrics story.",
      strengths: ["Bold bets", "Founder-friendly terms"],
      risks: ["Slow process", "Contrarian views"],
      talkingPoints: [
        "Jennifer published a long essay on the FF blog about why most AI companies will fail at distribution",
        "She's been tweeting about frontier model economics and the 'compute wall' debate",
      ],
      interests: ["Moonshot potential", "Technical differentiation"],
      bestReachTime: "Email, slow responder",
      insightsUpdatedAt: weeksAgo(2),
      companyNews: [
        {
          id: "news-ff-1",
          headline:
            "Founders Fund leads $150M round in defense tech startup Anduril",
          date: daysAgo(6),
          sourceUrl: "https://foundersfund.com",
          category: "funding",
        },
        {
          id: "news-ff-2",
          headline:
            "Peter Thiel announces new Founders Fund fellowship for contrarian founders",
          date: daysAgo(17),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Founders Fund swings big — pitch the 10-year vision, not quarterly metrics\n- Slow process and she's a contrarian thinker, don't expect quick replies\n- Still waiting on her feedback on our vision deck, follow up gently",
      quickFacts: ["SpaceX board", "Contrarian investor"],
      personalDetails: "Pilot. Burning Man regular.",
      notesUpdatedAt: weeksAgo(2),
    },

    interestingFacts: [
      {
        id: "fact-inv8-1",
        content:
          "Licensed pilot — she flew herself to our meeting in a Cirrus SR22 and talked about it for 10 minutes",
        source: "Meeting - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "hobby",
      },
      {
        id: "fact-inv8-2",
        content:
          "Goes to Burning Man every year and organizes a camp for tech founders — said it's her 'reset button'",
        source: "Email - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv8-3",
        content:
          "Just adopted a whippet named Rocket — she joked that the dog is faster than her plane",
        source: "Coffee chat - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Vision", "Technical Approach"],

    interactions: [
      {
        id: "int-inv8-1",
        type: "email",
        date: weeksAgo(2),
        subject: "Vision Deck",
        summary: "Sent our long-term vision deck. Awaiting feedback.",
        sentiment: "neutral",
        keyTopics: ["Vision"],
      },
    ],

    lastContacted: weeksAgo(2),
    nextFollowUp: daysAgo(-10),
    firstContact: monthsAgo(1),
    createdAt: monthsAgo(1),
    updatedAt: weeksAgo(2),
  },

  {
    id: "inv-9",
    firstName: "Marcus",
    lastName: "Williams",
    avatarUrl: "/avatars/1638984592888.jpeg",
    company: "General Catalyst",
    title: "Managing Director",
    department: "Growth Equity",
    email: "mwilliams@generalcatalyst.com",
    phone: "+1 (617) 555-1809",
    linkedIn: "linkedin.com/in/marcuswilliams",
    timezone: "America/New_York",
    location: "Boston, MA",
    category: "investor",

    relationship: "decision_maker",
    relationshipScore: 75,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["investor", "Sentra", "Glean"],

    insights: {
      aiSummary:
        "Marcus has quickly become one of my favorite Series B conversations. He comes from an operator background and asks the most practical questions of anyone I've talked to — stuff like 'what does your onboarding flow look like at step 3' not just high-level TAM stuff. He'll probably want a board seat, which is fine if the terms are right. We had a deep diligence call last week and he was impressed with our operational efficiency.",
      strengths: ["Operational background", "Healthcare/Enterprise expertise"],
      risks: ["May want board seat"],
      talkingPoints: [
        "Marcus published a GC blog post on operational playbooks for scaling from $5M to $50M ARR",
        "He's been doing a series of Twitter Spaces on 'operator-investors' and what they bring to boards",
        "Led a round in a healthcare AI startup last month — expanding his thesis into vertical AI",
      ],
      interests: ["Go-to-market", "Operational efficiency"],
      bestReachTime: "Prefers scheduled calls",
      insightsUpdatedAt: daysAgo(6),
      companyNews: [
        {
          id: "news-gc-1",
          headline:
            "General Catalyst launches 'Resilience' platform to help portfolio companies weather downturns",
          date: daysAgo(4),
          sourceUrl: "https://generalcatalyst.com/stories",
          category: "product",
        },
        {
          id: "news-gc-2",
          headline:
            "General Catalyst raises $6B mega-fund, largest in firm history",
          date: daysAgo(13),
          category: "funding",
        },
        {
          id: "news-gc-3",
          headline:
            "GC appoints new operating partner from Stripe to lead fintech practice",
          date: daysAgo(23),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Operator background means he asks the most practical diligence questions of any investor\n- Will likely want a board seat — need to think through board dynamics early\n- Prefers scheduled calls, always comes overprepared with specific questions",
      quickFacts: ["Ex-HubSpot COO", "Board at 8 companies"],
      personalDetails: "Runs daily. Big on fitness.",
      notesUpdatedAt: daysAgo(6),
    },

    interestingFacts: [
      {
        id: "fact-inv9-1",
        content:
          "Runs every morning at 5:30 AM along the Charles River — training for the Boston Marathon in April",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv9-2",
        content:
          "His wife just opened a bakery in Cambridge and he keeps bringing pastries to investor meetings",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "family",
      },
    ],

    recentTopics: ["Operational Support", "Board Composition"],

    interactions: [
      {
        id: "int-inv9-1",
        type: "call",
        date: daysAgo(6),
        subject: "Diligence Call",
        summary: "Deep dive on operations. He's impressed with our efficiency.",
        sentiment: "positive",
        keyTopics: ["Operations", "Diligence"],
      },
    ],

    lastContacted: daysAgo(6),
    nextFollowUp: daysAgo(-4),
    firstContact: monthsAgo(2),
    createdAt: monthsAgo(2),
    updatedAt: daysAgo(6),
  },

  {
    id: "inv-10",
    firstName: "Amanda",
    lastName: "Chen",
    avatarUrl: "/avatars/1714012339927.jpeg",
    company: "Bessemer Venture Partners",
    title: "Partner",
    department: "Cloud",
    email: "achen@bvp.com",
    phone: "+1 (415) 555-1910",
    linkedIn: "linkedin.com/in/amandachen",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "investor",

    relationship: "contact",
    relationshipScore: 58,
    communicationStyle: "async",

    roleBadges: [],
    tags: ["investor", "A16Z"],

    insights: {
      aiSummary:
        "Amanda is probably the most metrics-savvy investor I've spoken to — she literally created the BVP Cloud Index so she knows every cloud benchmark cold. She's interested in us but told me straight up we need to hit $5M ARR before she'll engage seriously. I respect the honesty. We're keeping her updated quarterly and she's been helpful even from the sidelines with benchmarking advice.",
      strengths: ["Deep cloud expertise", "BVP cloud index"],
      risks: ["High ARR bar"],
      talkingPoints: [
        "Amanda published the 2026 State of the Cloud report — it's the industry benchmark and she's been doing a press tour around it",
        "She's been tweeting about net dollar retention being the single most important SaaS metric right now",
      ],
      interests: ["Cloud metrics", "NDR", "CAC payback"],
      bestReachTime: "Email preferred",
      insightsUpdatedAt: weeksAgo(1),
      companyNews: [
        {
          id: "news-bvp-1",
          headline:
            "Bessemer Venture Partners publishes 2026 State of the Cloud report",
          date: daysAgo(3),
          sourceUrl: "https://bvp.com/cloud",
          category: "press",
        },
        {
          id: "news-bvp-2",
          headline:
            "BVP portfolio company Canva reaches $40B valuation in secondary sale",
          date: daysAgo(11),
          category: "funding",
        },
        {
          id: "news-bvp-3",
          headline:
            "Bessemer launches dedicated AI practice led by new partner hire from Google DeepMind",
          date: daysAgo(22),
          category: "leadership",
        },
      ],
    },

    notes: {
      customSummary:
        "- Told us straight up we need $5M ARR before she'll do a deep dive — respect the honesty\n- Helpful from the sidelines with cloud benchmarking advice even though she's not engaging yet\n- Keep sending quarterly updates, she reads everything",
      quickFacts: ["Created BVP Cloud Index", "Twilio early investor"],
      personalDetails: "Competitive tennis player.",
      notesUpdatedAt: weeksAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-inv10-1",
        content:
          "Competitive USTA tennis player — she plays doubles every Saturday morning and just won a local tournament",
        source: "Email - Jan 2026",
        extractedAt: weeksAgo(3),
        category: "hobby",
      },
      {
        id: "fact-inv10-2",
        content:
          "Took her family to Japan over the holidays — she couldn't stop talking about the ramen in Kyoto",
        source: "Call - Jan 2026",
        extractedAt: weeksAgo(1),
        category: "travel",
      },
    ],

    recentTopics: ["Cloud Metrics", "ARR Growth"],

    interactions: [
      {
        id: "int-inv10-1",
        type: "email",
        date: weeksAgo(1),
        subject: "Metrics Update",
        summary:
          "Shared Q4 metrics. She wants to reconnect when we hit $5M ARR.",
        sentiment: "neutral",
        keyTopics: ["Metrics", "Timeline"],
      },
    ],

    lastContacted: weeksAgo(1),
    nextFollowUp: daysAgo(-30),
    firstContact: monthsAgo(4),
    createdAt: monthsAgo(4),
    updatedAt: weeksAgo(1),
  },

  {
    id: "inv-11",
    firstName: "Peter",
    lastName: "Nguyen",
    avatarUrl: "/avatars/1649172671277.jpeg",
    company: "Insight Partners",
    title: "Managing Director",
    department: "Software",
    email: "pnguyen@insightpartners.com",
    phone: "+1 (212) 555-2011",
    linkedIn: "linkedin.com/in/peternguyen",
    timezone: "America/New_York",
    location: "New York, NY",
    category: "investor",

    relationship: "contact",
    relationshipScore: 52,
    communicationStyle: "formal",

    roleBadges: [],
    tags: ["friend", "Sentra"],

    insights: {
      aiSummary:
        "Peter is a long-term play for us. Insight typically comes in at Series C and beyond, so we're way too early for them right now. But he's been friendly and I send him an annual update just to stay on his radar. When we hit scale, I want him in the conversation. Not much of a personal relationship yet — we've only met once in person.",
      strengths: ["Huge fund", "Scale expertise"],
      risks: ["We're too early for their stage"],
      talkingPoints: [
        "Peter was quoted in a Fortune piece about the 'growth equity reset' and what valuations look like in 2026",
        "He keynoted the Insight onsite about building international GTM motions — posted highlights on LinkedIn",
      ],
      interests: ["Scale", "International expansion"],
      bestReachTime: "Annual check-ins",
      insightsUpdatedAt: monthsAgo(1),
      companyNews: [
        {
          id: "news-insight-1",
          headline:
            "Insight Partners marks down several portfolio companies amid valuation reset",
          date: daysAgo(8),
          sourceUrl: "https://insightpartners.com/blog",
          category: "funding",
        },
        {
          id: "news-insight-2",
          headline:
            "Insight launches ScaleUp Academy program for high-growth portfolio companies",
          date: daysAgo(19),
          category: "product",
        },
      ],
    },

    notes: {
      customSummary:
        "- Insight invests Series C+ so we're too early, but keep him warm for when we get there\n- Annual update cadence is fine, don't over-communicate\n- When we hit scale, he's someone I want at the table",
      quickFacts: ["$30B AUM", "Focus on scale-ups"],
      personalDetails: "Jazz enthusiast.",
      notesUpdatedAt: monthsAgo(1),
    },

    interestingFacts: [
      {
        id: "fact-inv11-1",
        content:
          "Plays jazz saxophone on weekends — sits in with a quartet at a club in the West Village",
        source: "Meeting - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv11-2",
        content:
          "His family is originally from Saigon and he took his parents back to visit for the first time in 30 years over Thanksgiving",
        source: "Email - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "travel",
      },
    ],

    recentTopics: ["Long-term Plans"],

    interactions: [
      {
        id: "int-inv11-1",
        type: "email",
        date: monthsAgo(1),
        subject: "Annual Update",
        summary: "Sent annual update. Noted to reconnect at Series C stage.",
        sentiment: "neutral",
        keyTopics: ["Update"],
      },
    ],

    lastContacted: monthsAgo(1),
    nextFollowUp: monthsAgo(-6),
    firstContact: monthsAgo(8),
    createdAt: monthsAgo(8),
    updatedAt: monthsAgo(1),
  },

  {
    id: "inv-12",
    firstName: "Rachel",
    lastName: "Foster",
    avatarUrl: "/avatars/1677716095250.jpeg",
    company: "First Round Capital",
    title: "Partner",
    department: "Seed",
    email: "rfoster@firstround.com",
    phone: "+1 (415) 555-2112",
    linkedIn: "linkedin.com/in/rachelfoster",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    category: "investor",

    relationship: "champion",
    relationshipScore: 88,
    communicationStyle: "casual",

    roleBadges: [],
    tags: ["friend", "Sentra", "A16Z", "Glean"],

    insights: {
      aiSummary:
        "Rachel is hands-down our most engaged seed investor. She's constantly pinging me with intros to other founders, sending over First Round platform resources, and just generally being the kind of investor every founder dreams of. We talk multiple times a week — mostly on Slack — and she's always available when I need to vent or think through something. She can only do pro-rata at this stage but the value she adds goes way beyond capital.",
      strengths: [
        "FR community access",
        "Operator network",
        "Always available",
      ],
      risks: ["Pro-rata only at this stage"],
      talkingPoints: [
        "Rachel hosted a First Round founder dinner last week in SF — 30 founders, very curated",
        "She's been writing a series of posts on the FR blog about 'what seed investors owe their founders'",
        "Just got back from First Round's annual partner offsite in Aspen",
      ],
      interests: ["Founder community", "Knowledge sharing"],
      bestReachTime: "Very responsive - any channel",
      insightsUpdatedAt: daysAgo(4),
      companyNews: [
        {
          id: "news-fr-1",
          headline:
            "First Round Capital publishes annual State of Startups survey with insights from 1,000 founders",
          date: daysAgo(5),
          sourceUrl: "https://firstround.com/review",
          category: "press",
        },
        {
          id: "news-fr-2",
          headline:
            "First Round Review launches podcast series interviewing breakout founders",
          date: daysAgo(14),
          category: "product",
        },
        {
          id: "news-fr-3",
          headline:
            "First Round hosts annual CEO Summit in San Francisco with 200 founders",
          date: daysAgo(26),
          category: "general",
        },
      ],
    },

    notes: {
      customSummary:
        "- Goes above and beyond — FR community intros have been incredibly valuable for us\n- Available on any channel any time, mostly communicate on Slack\n- Can only do pro-rata at this stage but the non-capital value is enormous",
      quickFacts: ["Built FR's platform team", "2x founder"],
      personalDetails: "Rescue dog mom. Foodie.",
      notesUpdatedAt: daysAgo(4),
    },

    interestingFacts: [
      {
        id: "fact-inv12-1",
        content:
          "Rescue dog mom — her mutt Biscuit has his own Slack emoji in the FR workspace and she posts daily photos",
        source: "Slack - Jan 2026",
        extractedAt: weeksAgo(2),
        category: "family",
      },
      {
        id: "fact-inv12-2",
        content:
          "Serious foodie — took me to a hidden omakase spot in the Sunset that doesn't even have a sign on the door",
        source: "Coffee chat - Dec 2025",
        extractedAt: monthsAgo(2),
        category: "hobby",
      },
      {
        id: "fact-inv12-3",
        content:
          "Started doing ceramics classes in January — she brought a handmade mug to our last coffee meeting",
        source: "Meeting - Nov 2025",
        extractedAt: monthsAgo(3),
        category: "hobby",
      },
    ],

    recentTopics: ["FR Community", "Founder Intros"],

    interactions: [
      {
        id: "int-inv12-1",
        type: "slack",
        date: daysAgo(4),
        subject: "Founder Intro",
        summary: "Intro'd us to 3 founders in adjacent spaces. Always helpful.",
        sentiment: "positive",
        keyTopics: ["Introductions", "Community"],
      },
    ],

    lastContacted: daysAgo(4),
    nextFollowUp: daysAgo(-10),
    firstContact: monthsAgo(14),
    createdAt: monthsAgo(14),
    updatedAt: daysAgo(4),
  },
];
