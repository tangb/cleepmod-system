#!/usr/bin/env python
# -*- coding: utf-8 -*-

from raspiot.events.formatter import Formatter
from raspiot.events.soundTextToSpeechProfile import SoundTextToSpeechProfile

class SystemSunriseToTextToSpeechFormatter(Formatter):
    """
    Sunrise data to TextToSpeechProfile
    """
    def __init__(self, events_factory):
        """
        Contructor

        Args:
            events_factory (EventsFactory): events factory instance
        """
        Formatter.__init__(self, events_factory, u'system.time.sunrise', SoundTextToSpeechProfile())

    def _fill_profile(self, event_values, profile):
        """
        Fill profile with event data

        Args:
            event_values (dict): event values
            profile (Profile): profile instance
        """
        profile.text = u'It\'s sunrise!'

        return profile

