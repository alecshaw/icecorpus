node: NP*

copy_corpus: t

// define: EME.def

query: (!NP-ADV* iDoms [2]NP)
   AND ([1]NP* iDoms {1}[2]NP)
   AND ([1]NP* iDoms !CONJP|$)

append_label{1}: -ZZZ
