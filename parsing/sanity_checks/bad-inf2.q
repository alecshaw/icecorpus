node: IP*

define: ../def/ICE.def

copy_corpus: t

query: (IP* iDoms VBD*|VBP*)
   AND (IP* iDoms {1}VB|DO|RD|BE|MD|HV)

append_label{1}: -ZZZ-NO-IP-INF
