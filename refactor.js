$scope.checkAllFieldsPresent = function () {
  if ($scope.requestedListingData) {
	var atleastOneBookableSelected = false, nowTemp, currentDate, checkInDate;

	if (!$scope.requestedListingData.date_from || !$scope.requestedListingData.date_until) {
		// Check is either check in or check out is not selected
		$scope.showMessage('Please select your check-in and check-out dates');
		return false;
	}
	
	nowTemp = new Date();
	currentDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);	
	checkInDate = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY').toDate();
	
	if (checkInDate < currentDate) {
		// Is checkin in past?
		if ($scope.packeageType !== 1 && $scope.listing.code === 'startuptour' && $scope.listing.config['default_date']) {
			// hack to get statup tour request video working
			angular.forEach($scope.requestedListingData.bookables, function (bookable) {
				bookable.requested = 1;
			});
			return true;
		}

		$scope.showMessage('Please check-in date cannot be in past');
		return false;
	}
	else{
		// Is there atleast on bookable?
		angular.forEach($scope.requestedListingData.bookables, function (value) {
			if (value && value.requested > 0) {
				atleastOneBookableSelected = true;
			}
		});
		if (!atleastOneBookableSelected) {
			$scope.showMessage('Please select atleast one stay/experience');
			return false;
		}
	}
	 
	 if (checkInDate.getTime() == currentDate.getTime() && nowTemp.getHours() >= 24 - $scope.configs.min_hours_for_booking) {
		// Check if booking is possible is checkin date is today
		$scope.showMessage('Booking is closed for today. Please try for next day.');
		return false;
	} else {
		return true;
	}
  } else {
	$scope.showMessage("Internal error, please refresh the page and continue");
	return false;
  }
}