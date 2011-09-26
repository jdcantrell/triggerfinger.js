# Overall goal
triggerFinger.js is a small script that will keep track and report on all handlers that get set up via
jquery's bind, once, delegate, and live. It has two basic reports, one that gives an overview
of what handlers have been set up, and another that shows how many times a handler is called.

This project is just starting up so here are some more planning details:

# What we should record?
## Modify jquery's bind/once to record:
* selector
* element
* function (name, file would be nice)
* how it was bound (live, delegate, once, bind)
* trace - (where in the code it was triggered)

## Modify trigger to record:
* # times of fired
* trigger time
* event 
* trace - (where in the code it was triggered)

# Questions we want answered from the reports:
1. What and how are events being bound to this element
2. How many events are we binding to and how many events are never fired

# Nice to haves
* Bookmarklet - maybe?
* non-jquery event reporting
* nice html interface for viewing read out
* useful console/query tool
* ie

