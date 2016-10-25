# GeoLocator

BLocator is a geolocation and geotracking web application. It let users:
- choose among OpenStreetMap, Google Maps, and a hybrid map that is a Google Map with OpenStreetMap tiles placed on it (this feature does not work on Firefox OS at the moment: see [issue #7](https://github.com/franciov/geo/issues/7) for details)
- track connected users on the map


![Screenshot](https://lh6.googleusercontent.com/tjF3ZCJda4JGjzhaxvAI6dTzYVQjhI4WUphV_bGfX3B7txA9CW9EYtXMI5JCj8r7AUq1qKHPqyG8GZ0=w1920-h950)
![Screenshot](https://lh5.googleusercontent.com/RTxKglgXKtWM7ZeBHA6ibwCTYNfPB6LXwkmFsgIyqvJsJ6uPF26j9kSQxy7qcGU0TA4QspPXWtpwea4=w1920-h950)

## Notes
Based on [geo](https://github.com/franciov/geo)code example code.
This demo is part of the following MDN articles:
- [Plotting yourself on the map (MDN App Center)](https://developer.mozilla.org/en-US/Apps/Developing/gather_and_modify_data/Plotting_yourself_on_the_map) that explains how to use interactive maps in Open Web Apps.
- [Updating phone contacts from the web (MDN App Center)](https://developer.mozilla.org/en-US/Apps/Developing/gather_and_modify_data/Updating_phone_contacts_from_the_web) that explains how to use the [Contacts API](https://developer.mozilla.org/en-US/docs/WebAPI/Contacts) in Open Web Apps.

Note that OpenStreetMap data is free for everyone to use, but OpenStreetMap tile servers are not: heavy use of OpenStreetMap tiles is forbidden without prior permission from OpenStreetMap's System Administrators: please read the [Tile Usage Policy](http://wiki.openstreetmap.org/wiki/Tile_usage_policy) and [this article on blog.openstreetmap.org](https://blog.openstreetmap.org/2011/11/01/tile-usage-policy/) if you want to distribute an app that gets use of tiles from openstreetmap.org
