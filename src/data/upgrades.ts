import type { Upgrade } from '../types/index';

export const UPGRADES: Upgrade[] = [
  {
    id: 1,
    name: 'AI Datacenter Expansion',
    description: "Build massive server farms for AI while buying cheap renewable certificates to claim 'clean energy'.",
    category: 'production',
    cost: 500,
    moneyPerSecond: 25,
    pollutionPerSecond: 15,
    educationalMessage:
      "Tech giants claim their AI queries are powered by 100% renewable energy by purchasing Unbundled Renewable Energy Certificates (RECs), even while their actual local servers demand massive amounts of regional fossil fuels.",
    realWorldEvidence:
      "Google's emissions have surged 48% since 2019, driven directly by the massive electricity and cooling demands of AI data center expansion.",
    source: 'The Guardian',
    sourceUrl: 'https://www.theguardian.com/technology/article/2024/jul/02/google-ai-emissions',
  },
  {
    id: 2,
    name: '“Carbon Neutral” Smartwatches',
    description: 'Offset overseas manufacturing emissions with cheap, short-term carbon credits.',
    category: 'production',
    cost: 1500,
    moneyPerSecond: 75,
    pollutionPerSecond: 40,
    educationalMessage:
      "Hardware companies market devices as their 'first carbon-neutral product' by buying carbon credits (like planting trees in Kenya). However, investigations show these credits are often short-term, worthless, and fail to provide genuine long-term carbon reductions.",
    realWorldEvidence:
      "Apple faced a US class-action lawsuit and was banned by a German court from advertising the Apple Watch as 'CO2-neutral' due to its reliance on highly questionable offset projects.",
    source: 'Trellis',
    sourceUrl: 'https://trellis.net/article/apple-carbon-neutral-german-court-case/',
  },
  {
    id: 3,
    name: 'Right to Repair Obstruction',
    description: "Use 'part-pairing' software to block independent repair, forcing consumers to buy new devices.",
    category: 'production',
    cost: 3000,
    moneyPerSecond: 150,
    pollutionPerSecond: 85,
    educationalMessage:
      "While heavily marketing their 'recycling robots', tech companies lock down their hardware via proprietary screws and software 'serialization' so consumers can't fix their own screens or batteries, generating massive e-waste and forcing new sales.",
    realWorldEvidence:
      "Apple and John Deere have historically heavily lobbied against 'Right to Repair' laws while pushing PR campaigns about their internal recycling efforts.",
    source: 'Medium',
    sourceUrl: 'https://doctorow.medium.com/apple-fucked-us-on-right-to-repair-again-df4b35030480',
  },
  {
    id: 4,
    name: 'Proof-of-Work Crypto Mining',
    description: 'Run massive crypto mining rigs while claiming to “balance the renewable energy grid”.',
    category: 'production',
    cost: 6500,
    moneyPerSecond: 350,
    pollutionPerSecond: 220,
    educationalMessage:
      "Crypto prospectors claim their multi-megawatt mining rigs 'soak up excess solar/wind energy', but in reality they just increase baseline grid load, forcing municipal grids to burn more coal and natural gas to keep local lights on.",
    realWorldEvidence:
      'Bitcoin mining consumes as much electricity annually as entire small countries, largely utilizing cheap fossil fuels.',
    source: 'Forbes',
    sourceUrl: 'https://www.theverge.com/2021/3/15/22328203/nft-cryptoart-ethereum-blockchain-climate-change',
  },
  {
    id: 5,
    name: 'Planned Firmware Obsolescence',
    description: 'Push software updates that secretly throttle battery life to force user hardware upgrades.',
    category: 'production',
    cost: 12000,
    moneyPerSecond: 600,
    pollutionPerSecond: 500,
    educationalMessage:
      "Companies release PR statements about building 'durable' tech to keep devices out of landfills, while simultaneously pushing mandatory OS updates that intentionally slow down older models' processors to frustrate users into upgrading.",
    realWorldEvidence:
      "Apple paid $500 million to settle the 'Batterygate' lawsuit for secretly throttling older iPhones, a practice deeply contradicting their green marketing.",
    source: 'Earth.org',
    sourceUrl:
      'https://www.reuters.com/article/us-apple-iphones-settlement/apple-agrees-to-pay-up-to-500-million-to-settle-u-s-lawsuit-over-slow-iphones-idUSKBN20P2E7',
  },
  {
    id: 6,
    name: 'Scrap Net Zero Timelines',
    description: "Quietly abandon public 'Net Zero' targets while pivoting PR strategy to 'AI Innovation'.",
    category: 'perception',
    cost: 1000,
    perceptionImpact: 5,
    educationalMessage:
      "Tech companies make huge, public 'Net Zero' promises to get good PR today. When the time comes to actually cut emissions—or when a highly polluting tech like AI becomes profitable—they quietly scrap the timeline and scrub it from their site.",
    realWorldEvidence:
      "Microsoft recently admitted their carbon negative by 2030 target was 'further out of reach' due to massive AI investments, while Google dropped 'operational carbon neutrality' entirely in 2024.",
    source: 'Forbes',
    sourceUrl:
      'https://www.forbes.com/sites/jemmagreen/2024/08/29/why-big-corporations-are-quietly-abandoning-their-climate-commitments/',
  },
  {
    id: 7,
    name: "Launch a 'Climate Pledge'",
    description: 'Found a non-binding corporate climate pledge while simultaneously increasing operational emissions.',
    category: 'perception',
    cost: 2500,
    perceptionImpact: 10,
    educationalMessage:
      "Mega-retailers create slick, highly-marketed 'Pledges' to achieve net-zero in the distant future. Because there is no legal accountability, they use it as an ESG marketing shield while their actual direct transportation emissions skyrocket.",
    realWorldEvidence:
      "Amazon launched the highly publicized 'Climate Pledge', but its total carbon emissions have increased by approximately 40% between 2019 and 2022.",
    source: 'New Climate Institute',
    sourceUrl:
      'https://newclimate.org/sites/default/files/2024-08/NewClimate_CCRM2024.pdf#:~:text=The%20first%20iteration%20of%20the%20CCRM%2C%20published,to%20be%20aligned%20with%201.5%C2%B0C%20compatible%20pathways.',
  },
  {
    id: 8,
    name: 'PFC Abatement Accounting',
    description:
      "Boast about new factory 'scrubbers' to show a 90% efficiency gain, carefully masking the massive overall increase in your absolute emissions.",
    category: 'perception',
    cost: 5000,
    perceptionImpact: 15,
    educationalMessage:
      "Semiconductor manufacturing relies heavily on Perfluorocompounds (PFCs)—gases up to 23,000 times more potent than CO2. Chipmakers generate incredible PR by installing abatement scrubbers and bragging about 'efficiency reductions per wafer.' However, they use this metric to deliberately mask the fact that their absolute, total climate emissions are constantly skyrocketing due to massive production volume growth.",
    realWorldEvidence:
      "Major semiconductor companies frequently publish sustainability reports highlighting their successful 'per-chip' greenhouse gas reductions, even as their actual total corporate carbon and PFC emissions double and triple over the exact same period.",
    source: 'The Guardian',
    sourceUrl: 'https://www.theguardian.com/environment/2021/sep/18/semiconductor-silicon-chips-carbon-footprint-climate',
  },
  {
    id: 9,
    name: 'E-Waste “Recycling” Exportation',
    description: 'Put collection bins in your retail stores, then quietly ship the e-waste to developing nations.',
    category: 'perception',
    cost: 12000,
    perceptionImpact: 20,
    educationalMessage:
      "Hardware giants set up highly visible 'Trade-in and Recycle' programs in their sleek stores. Instead of safely recycling lithium and rare earth metals locally, they often sell the electronics to brokers who dump the toxic waste into foreign landfills.",
    realWorldEvidence:
      "Investigations have repeatedly caught major tech firms and certified 'recyclers' exporting hazardous e-waste to countries without toxic processing regulations.",
    source: 'Renewable Matter',
    sourceUrl: 'https://www.renewablematter.eu/en/europe-doesnt-recycle-its-ewaste-it-exports-the-problem',
  },
  {
    id: 10,
    name: 'Fund Anti-Climate Tech PACs',
    description: 'Tweet in support of the Paris Agreement while secretly funneling millions to anti-climate politicians.',
    category: 'perception',
    cost: 30000,
    perceptionImpact: 50,
    educationalMessage:
      'Silicon Valley billionaires and CEOs sign open letters supporting progressive climate legislation to appease tech workers, while their corporate Political Action Committees (PACs) quietly bankroll the exact representatives trying to dismantle the EPA.',
    realWorldEvidence:
      'Analysis routinely shows Alphabet, Meta, and Amazon publicly advocating for climate action while being top contributors to congressional committees that block climate bills.',
    source: 'Technology Magazine',
    sourceUrl: 'https://www.theguardian.com/environment/2019/oct/11/google-contributions-climate-change-deniers',
  },
];
