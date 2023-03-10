import { child, Database, get, ref } from 'firebase/database';
import { FEATM_SelectedFixutre } from '../../types/feat-match';
import { FIREBASE_SelectedFixture_LiveOdds_Response } from '../../types/firebase';

export async function FIREBASE_getTargetFixtureOdds (
  db_real_time: Database,
	fixture_data: FEATM_SelectedFixutre
): Promise < FIREBASE_SelectedFixture_LiveOdds_Response > {
	// ... DEBUGGING;
  // if (dev) logDevGroup ("firebase [DEV]", `fixture_data: ${fixture_data}`)
	// ... convert the datetime to the correct variables to search for the fixture;
	const year_: string = new Date(fixture_data.date).getFullYear().toString();
	const month_: number = new Date(fixture_data.date).getMonth();
	// ... apply-correct-month-structure;
	let new_month_ = (month_ + 1).toString();
	new_month_ = ('0' + new_month_).slice(-2);
	// ... apply-correct-day-structure;
	let day_ = new Date(fixture_data.date).getUTCDate().toString();
	day_ = ('0' + day_).slice(-2);
	// ... obtain FIXTURE-ID;
	const fixtureId = fixture_data.fixture_id;
	// ... obtain-fixture-language;
	const lang: string = fixture_data.lang;
	// ... obtain-sportbook-details;
	const sportbook_details = await FIREBASE_getTargetGeoSportBookDetails (
    db_real_time,
    lang
  );
  // if (dev) logDevGroup ("firebase [DEV]", `odds/${year_}/${new_month_}/${day_}/${fixtureId}`)
	// ... return the odds-site info & the odds values;
	return get(child(ref(db_real_time), `odds/${year_}/${new_month_}/${day_}/${fixtureId}`)).then(
		(snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {
				// ...
				const fixture_odds = snapshot.val();
				const fixture_odds_keys = Object.keys(snapshot.val());
				// ... get the `sportbook-details` data;
				const map = new Map();
				let count = 0;
				// ... iterate over the data of the `lang` in sportbook details;
				for (const rankedOdd in sportbook_details) {
					// ... iterate over the data of the fixture avaiable ODDS;
					for (const avaiableOdd in fixture_odds_keys) {
						// ...
						const targetFixture = fixture_odds_keys[avaiableOdd];
						const fixtureOdd = fixture_odds[targetFixture];
						// ... check for a match of the odds names;
						if (fixture_odds_keys[avaiableOdd].toString().toLowerCase() == sportbook_details[rankedOdd]['title'].toString().toLowerCase() &&
							fixtureOdd['markets']['1X2FT'] != null &&
							fixtureOdd['markets'] != null &&
							count != 1) {
							// ...
							map.set('fixture_odds', fixtureOdd);
							map.set('fixture_odds_info', sportbook_details[rankedOdd]);
							count = 1;
						}
					}
				}
				// ...
				const obj = Object.fromEntries(map);
				// ... return the response as an Array;
				return obj;
			} else {
				throw new Error(`Data from DB is incorrect: getTargetFixtureOdds() fixture_data ${fixture_data}`);
			}
		}
	);
}

export async function FIREBASE_getTargetGeoSportBookDetails (
  db_real_time: Database,
  lang: string,
  siteName?: string
): Promise < any > {
	// ... return the odds-site info & the odds values;
	if (siteName != undefined) {
    // if (dev) logDevGroup ("firebase [DEV]", `siteName: ${siteName}`)
		return get(child(ref(db_real_time), `sportsbook_details/${lang}`)).then((snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {

				const map = new Map();
				const sportbook_details_ = snapshot.val();

				for (const rankedOdd in sportbook_details_) {
					// ... check for a match of the odds names;
					if (
						siteName.toLowerCase().toString() ==
						sportbook_details_[rankedOdd]['title'].toLowerCase().toString()
					) {
						map.set('betting_site_info', sportbook_details_[rankedOdd]);
					}
				}

				const obj = Object.fromEntries(map);

				// ... return the response as an Array;
				return obj;
			} else {
				throw new Error(`Data from DB is incorrect: getTargetGeoSportBookDetails() lang: ${lang} sitename: ${siteName}`);
			}
		});
	} else {
		return get(child(ref(db_real_time), `sportsbook_details/${lang}`)).then((snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {

				// return the response as an Array;
				return snapshot.val();
			} else {
				// throw new Error(`Data from DB is incorrect: getTargetGeoSportBookDetails() lang-only: ${getTargetGeoSportBookDetails}`);
			}
		});
	}
}

export async function FIREBASE_getAllSportbookDetails(
  db_real_time: Database,
): Promise < any > {
  return get(child(ref(db_real_time), `sportsbook_details`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return;
    }
  })
}

// DEPRECETAED:

// export async function getAllLiveScoresFootball(): Promise < LiveScore_SEO_Game[] > {
//   return get(child(ref(db_real), `livescores_table/livescores_today`)).then((snapshot) => {
//     if (snapshot.exists()) {
//       return snapshot.val()
//     } else {
//       return;
//     }
//   })
// }