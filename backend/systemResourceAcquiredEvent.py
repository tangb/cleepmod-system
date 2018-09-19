#!/usr/bin/env python
# -*- coding: utf-8 -*-

from raspiot.events.event import Event

class SystemResourceAcquiredEvent(Event):
    """
    system.resource.acquired event
    """

    EVENT_NAME = u'system.resource.acquired'
    EVENT_SYSTEM = True

    def __init__(self, bus, formatters_factory, events_factory):
        """
        Constructor

        Args:
            bus (MessageBus): message bus instance
            formatters_factory (FormattersFactory): formatters factory instance
            events_factory (EventsFactory): events factory instance
        """
        Event.__init__(self, bus, formatters_factory, events_factory)

    def _check_params(self, params):
        """
        Check event parameters

        Args:
            params (dict): event parameters

        Return:
            bool: True if params are valid, False otherwise
        """
        return all(key in [u'resource', u'module'] for key in params.keys())

