node: IP*|QTP|FRAG

copy_corpus: t

query: (IP*|QTP|FRAG doms {1}CP-CMP*|CP-THT*|CP-QUE|CP-DEG*|CP-REL*|CP-CAR*|CP-FRL*|CP-CLF*|CP-ADV*) AND (CP-CMP*|CP-THT*|CP-QUE|CP-DEG*|CP-REL*|CP-CAR*|CP-FRL*|CP-CLF*|CP-ADV* idoms IP-SUB*) AND (CP-CMP*|CP-THT*|CP-QUE|CP-DEG*|CP-REL*|CP-CAR*|CP-FRL*|CP-CLF*|CP-ADV* idoms !C)

append_label{1}: -ZZZ-MISS_C
