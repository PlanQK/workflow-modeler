# Popup Menu

## Search
when calling popupMenu.open, set in the options the search: true to configure the search, will only be shown if you have more than 5 entries in your menu.

'''javascript
const searchable = useMemo(() => {
    if (!isDefined(search)) {
      return false;
    }

    return originalEntries.length > 5;
  }, [ search, originalEntries ]);
'''