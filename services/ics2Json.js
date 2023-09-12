import ICAL from 'ical.js';

export const fetchIcsFromURL = async (url) => {
    try {
        const response = await fetch(url);

        if (response.status !== 200) {
            throw new Error('Failed to fetch .ics file');
        }

        return await response.text();
    } catch (error) {
        console.error("Error fetching .ics content:", error);
        throw error;
    }
};


const convertIcsToJson = async (icsString) => {

    const jcalData = ICAL.parse(icsString);
    const comp = new ICAL.Component(jcalData);

    const uniqueGroupsSet = new Set();

    let events = comp.getAllSubcomponents('vevent').map((vevent) => {
        const event = new ICAL.Event(vevent);
        const description = event.description.split('\n');
        const groups = description.reduce((acc, line) => {
            const matches = line.match(/(Gr(?![2 ]*CMI)[a-zA-Z0-9. ]+|L3\/[a-zA-Z0-9. ]+|Ergonomie|Réathletisation|Santé par le sport|Poly\.\s?[a-zA-Z0-9\s]+)/g);
            if (matches) {
                acc.push(...matches);
            }
            return acc;
        }, []);

        groups.forEach(group => uniqueGroupsSet.add(group));

        return {
            startTime: event.startDate.toJSDate(),
            endTime: event.endDate.toJSDate(),
            courseName: event.summary,
            location: event.location,
            groups,
        };
    });

    events = events.filter(event => !event.groups.includes("Gr2 CMI"));
    const uniqueGroups = [...uniqueGroupsSet].filter(group => group !== "Gr2 CMI");

    return {
        events,
        uniqueGroups,
    };
};

export async function fetchDataAndConvert(url) {
    try {
        const icsContent = await fetchIcsFromURL(url);
        return await convertIcsToJson(icsContent);
    } catch (error) {
        console.error("Error in fetchDataAndConvert:", error);
        return [];
    }
}

