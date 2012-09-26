<?php

	$visitLists = array(array("a","b","c","d"),array("e","f","g","h"));;
	$init_visit_numbers = count($visitLists);

	echo $init_visit_numbers;

	/**if ($init_visit_numbers > 0) {
		$visit_date = $visitLists[0]['visitDate'];
		$visit_purpose = $visitLists[0]['visitPurpose'];
		$visit_note = $visitLists[0]['visitNote'];
		
		$query="INSERT INTO studentvisit (studentId
									, visit_date
									, visit_purpose
									, visit_note) 
									VALUES 
									('$new_id'
									,'$visit_date'
									,'$visit_purpose'
									,'$visit_note')";
		for ($i = 1; $i != $init_visit_numbers; $i++) {
			$visit_date = $visitLists[$i]['visitDate'];
			$visit_purpose = $visitLists[$i]['visitPurpose'];
			$visit_note = $visitLists[$i]['visitNote'];

			$query = $query. ",('$new_id','$visit_date','$visit_purpose','$visit_note')"
			
				
		}

	}**/
?>