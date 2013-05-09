var $j = jQuery.noConflict();

$j(document).ready(function() {

	var isZA_B;
	var isZA_S;
	var setShipping = false;

	function setFields (shipto) {
		$j("label[for='" + shipto + "\\:region_id']").addClass('required');
		$j("label[for='" + shipto + "\\:region_id']").empty();
		$j("label[for='" + shipto + "\\:region_id']").append('<em>*</em>Town');
		
		var suburb_html = 
		'<div class="mds-' + shipto + ' field">' +
		'	<label class="required" for="mds:' + shipto + '_suburb"><em>*</em>Suburb</label>' +
		'	<div class="input-box">' +
		'		<select class="required-entry" title="Suburb" name="mds[' + shipto + '_suburb]" id="mds:' + shipto + '_suburb" defaultvalue="">' +
		'			<option value="">Please select a Town first</option>' +
		'		</select>' +
		'	</div>' +
		'</div>';
		$j("#" + shipto + "\\:city").parent().parent().parent().prepend(suburb_html);
		$j("#" + shipto + "\\:city").parent().parent().hide();
		
		var building_html = 
		'<li class="mds-' + shipto + ' wide">' +
		'	<label for="mds:' + shipto + '_building" class="required"><em>*</em>Building Details</label>' +
		'	<div class="input-box">' +
		'		<input title="Building Details" name="mds[' + shipto + '_building]" id="mds:' + shipto + '_building" value="" class="input-text required-entry" type="text">' +
		'	</div>' +
		'</li>';
		$j("#" + shipto + "\\:street1").parent().parent().before(building_html);
		
		var cptypes_html = 
		'<div class="mds-' + shipto + ' field">' +
		'	<label class="required" for="mds:' + shipto + '_cptypes"><em>*</em>Location Type</label>' +
		'	<div class="input-box">' +
		'		<select class="required-entry" title="Location Type" name="mds[' + shipto + '_cptypes]" id="mds:' + shipto + '_cptypes" defaultvalue="">' +
		'			<option value="">Loading...</option>' +
		'		</select>' +
		'	</div>' +
		'</div>';
		$j("#" + shipto + "\\:city").parent().parent().parent().append(cptypes_html);
		
		var cptypes_html = 
		'<div class="mds-' + shipto + ' field" style="display: none;">' +
		'	<div class="input-box">' +
		'		<input name="mds[' + shipto + '_town]" id="mds:' + shipto + '_town" value="" class="input-text required-entry" type="text">' +
		'	</div>' +
		'</div>';
		$j("#" + shipto + "\\:city").parent().parent().parent().append(cptypes_html);
	}

	function getSuburbs (shipto) {
		
		$j("#mds\\:" + shipto + "_suburb").empty();
		$j("#mds\\:" + shipto + "_suburb").append('<option value="">Loading...</option>');
		
		var data = {
			town	: $j("#" + shipto + "\\:region_id option:selected").text(),
		};
		jQuery.ajax({
			type : 'POST',
			url : "../../collivery/ajax/suburb",
			data : data,
			complete : function(response){
				$j("#mds\\:" + shipto + "_suburb").empty();
				$j("#mds\\:" + shipto + "_suburb").append(response['responseText']);
				$j("#" + shipto + "\\:city").val($j("#mds\\:" + shipto + "_suburb option:selected").text());
			}
		});
		
	}

	function getCPTypes (shipto) {
		
		$j("#mds\\:" + shipto + "_cptypes").empty();
		$j("#mds\\:" + shipto + "_cptypes").append('<option value="">Loading...</option>');
		
		jQuery.ajax({
			url : "../../collivery/ajax/cptypes",
			complete : function(response){
				$j("#mds\\:" + shipto + "_cptypes").empty();
				$j("#mds\\:" + shipto + "_cptypes").append(response['responseText']);
			}
		});
		
	}

	function setZA (shipto) {
		setFields(shipto);
		getCPTypes(shipto);
	}

	function unSetZA (shipto) {
		$j('.mds-' + shipto).remove();
		$j("#" + shipto + "\\:city").parent().parent().show();
		$j("label[for='" + shipto + "\\:region_id']").removeClass('required');
		$j("label[for='" + shipto + "\\:region_id']").empty();
		$j("label[for='" + shipto + "\\:region_id']").append('<em style="display: none;">*</em>State/Province');
	}

	jQuery('select#billing\\:country_id').live('change', function() {
		if ($j("#billing\\:country_id").val() == "ZA") {
			setZA('billing');
			isZA_B = true;
			if (!setShipping){
				setZA('shipping');
				$j("#shipping\\:country_id").val('ZA')
				isZA_S = true;
			}
		} else {
			if (isZA_B){
				unSetZA('billing');
				isZA_B = false;
			}
		}
	});
	
	jQuery('select#shipping\\:country_id').live('change', function() {
		if ($j("#shipping\\:country_id").val() == "ZA") {
			setZA('shipping');
			isZA_S = true;
			setShipping = true;
		} else {
			if (isZA_S){
				unSetZA('shipping');
				isZA_S = false;
				setShipping = true;
			}
		}
	});

	jQuery('select#billing\\:region_id').live('change', function() {
		if ($j("#billing\\:country_id").val() == "ZA") {
			$j("#mds\\:billing_town").val($j("#billing\\:region_id option:selected").text());
			getSuburbs('billing');
		}
	});
	
	jQuery('select#shipping\\:region_id').live('change', function() {
		if ($j("#shipping\\:country_id").val() == "ZA") {
			$j("#mds\\:shipping_town").val($j("#shipping\\:region_id option:selected").text());
			getSuburbs('shipping');
		}
	});

	jQuery('select#mds\\:billing_suburb').live('change', function() {
		$j("#billing\\:city").val($j("#mds\\:billing_suburb option:selected").text());
		if (!setShipping){
			$j("#shipping\\:city").val($j("#mds\\:billing_suburb option:selected").text());
			$j("#mds\\:shipping_suburb").val($j("#mds\\:billing_suburb option:selected").val());
		}
	});
	
	jQuery('select#mds\\:shipping_suburb').live('change', function() {
		$j("#shipping\\:city").val($j("#mds\\:shipping_suburb option:selected").text());
	});
	
	jQuery('select#mds\\:billing_cptypes').live('change', function() {
		$j("#mds\\:shipping_cptypes").val($j("#mds\\:billing_cptypes option:selected").val());
	});
	
	jQuery('#mds\\:billing_building').live('change', function() {
		$j('#mds\\:shipping_building').val($j('#mds\\:billing_building').val())
		
	});

	if ($j("#billing\\:country_id").val() == "ZA") {
		setZA('billing');
		isZA_B = true;
		if (!setShipping){
			setZA('shipping');
			isZA_S = true;
		}
	}

});
