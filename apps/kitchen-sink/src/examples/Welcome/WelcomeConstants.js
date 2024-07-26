import animationData from './assets/development.json'


export const lottieOptions = {
  loop: true,
  autoplay: true, 
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  },
};

export const buttonStyle={
  width: 300,
  height: 50,
  borderRadius: 100,
  fontWeight: 600,
  marginTop: 40,
  fontSize: 25,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.46,
  shadowRadius: 11.14,
}