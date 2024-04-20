
        const tryRequire = (path) => {
        	try {
        	const image = require(`${path}`);
        	return image
        	} catch (err) {
        	return false
        	}
        };

        export default {
        
	questionMark: require('./questionMark.png'),
	SocialFeed_PostImage: tryRequire('./SocialFeed_PostImage.png') || require('./questionMark.png'),
	SocialFeed_likeDislikeButtons: tryRequire('./SocialFeed_likeDislikeButtons.png') || require('./questionMark.png'),
}