node: IP*
define: def/ICE.def

copy_corpus: t

query: (P hasSister NP)
AND ({1}NP idoms *-N)
AND (P idoms !of-of|en-en|nema-nema)

append_label{1}: -ZZZ-BAD-PP-CASE
