import ICAL from 'ical.js';

export const fetchSchedule = async (url) => {
    try {
        const response = await fetch(url);
        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Failed to fetch .ics file');
        }

        // Read the content as a string
        const icsString = await response.text();

        // Now you can continue with parsing as before
        const jcalData = ICAL.parse(icsString);
        const comp = new ICAL.Component(jcalData);

        return comp.getAllSubcomponents('vevent').map((vevent) => {
            const event = new ICAL.Event(vevent);
            const description = event.description.split('\n');
            const group = description.find((line) => /(Gr[a-zA-Z0-9. ]+|L3\/[a-zA-Z0-9. ]+)/.test(line));
            const classe = description.find((line) => line.startsWith('L3'));

            return {
                startTime: event.startDate.toJSDate(),
                endTime: event.endDate.toJSDate(),
                courseName: event.summary,
                location: event.location,
                group,
            };
        });

    } catch (error) {
        console.error("Failed to fetch schedule:", error);
        return [];
    }
};

export const fetchGroupsFromIcs = async (url) => {
    try {
        const response = await fetch(url);

        if (response.status !== 200) {
            throw new Error('Failed to fetch .ics file');
        }

        const icsString = await response.text();
        const jcalData = ICAL.parse(icsString);
        const comp = new ICAL.Component(jcalData);

        const uniqueGroups = new Set();

        comp.getAllSubcomponents('vevent').forEach((vevent) => {
            const event = new ICAL.Event(vevent);
            const description = event.description;

            const lines = description.split('\n').map(line => line.trim());

            lines.forEach(line => {
                const foundGroups = line.match(/(Gr[a-zA-Z0-9. ]+|L3\/[a-zA-Z0-9. ]+)/);

                if (foundGroups) {
                    foundGroups.forEach(group => {
                        uniqueGroups.add(group.trim());
                    });
                }
            });
        });

        return Array.from(uniqueGroups);

    } catch (error) {
        console.error("Failed to fetch groups:", error);
        return [];
    }
};


