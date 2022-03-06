# Notes/Things to Improve

1. Tests focus on positive cases, ideally would also cover more negative cases, eg handling invalid input
2. Some potential efficiency improvements for question 3:
   - Because a worker's own available intervals never overlap, we could do something to prevent checking a worker's own available intervals when gettint out list of overlaps.
   - Currently all overlaps are double-counted (because we're counting the overlap for both the component intervals). It amounts to the same thing in our results, because the identical intervals are merged together, but it means we're doing more work than strictly necessary to get a list of all the overlaps.
3. The WorkerAvailability type is a bit redundant for this task, but it seemed like a good way to parse the input files if this was part of a hypothetical larger app, because that way we're not losing the worker id when we read the file
