build-prod:
	ionic cap sync --prod

build-android:
	ionic cap sync android

build-android-prod:
	ionic cap sync android --prod
	ionic cap open android

build-ios:
	ionic cap sync ios
	ionic cap open ios

build-ios-prod:
	ionic cap sync ios --prod
	ionic cap open ios

run-ios:
	ionic cap sync ios
	ionic cap open ios

run-ios-live:
	ionic cap sync ios
	ionic cap run ios -l --external

build-docker:
	docker build -t 913797522953.dkr.ecr.eu-west-1.amazonaws.com/stg-heart-frontend .
#ionic cap sync ios && ionic cap run ios -l --external
