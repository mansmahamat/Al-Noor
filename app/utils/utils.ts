import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan"


export function capitalizeFirstLetter(input: string): string {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}


export function getCalculationMethodByName(name) {
  const functionCalculationMethod = {
    muslimWorldLeague: CalculationMethod.MuslimWorldLeague(),
    egyptian: CalculationMethod.Egyptian(),
    karachi: CalculationMethod.Karachi(),
    ummAlQura: CalculationMethod.UmmAlQura(),
    dubai: CalculationMethod.Dubai(),
    qatar: CalculationMethod.Qatar(),
    kuwait: CalculationMethod.Kuwait(),
    moonsightingCommittee: CalculationMethod.MoonsightingCommittee(),
    singapore: CalculationMethod.Singapore(),
    turkey: CalculationMethod.Turkey(),
    tehran: CalculationMethod.Tehran(),
    northAmerica: CalculationMethod.NorthAmerica(),
    other: CalculationMethod.Other(),
  }

  if (functionCalculationMethod.hasOwnProperty(name)) {
    return functionCalculationMethod[name]
  } else {
    // Return a default method or handle the error as needed
    return CalculationMethod.MoonsightingCommittee() // Default to "Other" or handle the error appropriately
  }
}

  // MADHAB

  export function getCalculationMadhab(name) {
    const functionCalculationMadhab = {
      shafi: Madhab.Shafi,
      hanafi: Madhab.Hanafi,
    }

    if (functionCalculationMadhab.hasOwnProperty(name)) {
      return functionCalculationMadhab[name]
    } else {
      // Return a default method or handle the error as needed
      return Madhab.Shafi // Default to "Other" or handle the error appropriately
    }
  }