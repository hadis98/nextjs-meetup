import MeetupDetail from "../../components/meetups/MeetupDetail";
const MeetupDetails = () => {
  return (
    <MeetupDetail
      image="https://upload.wikimedia.org/wikipedia/commons/b/be/KeizersgrachtReguliersgrachtAmsterdam.jpg"
      title="First Meetup"
      address="Some street 5, some city"
      description="This is a first meetup"
    />
  );
};

// this is a dynamic page =>>
// we need its id  =>> it is encoded in the url
//we cant use useRouter hook to access id in url
//why?
//because useRouter can only be used in component function not in getStaticProps!!
// context parameter gives us url parameters

// because this page is dynamic nextjs needs to know for which id values it should be pre-generated tha page
// how could it pre-generate this page otherwise?
// if doesn't know its id during build process

export const getStaticPaths = async () => {
  return {
    // fallback key tells nextjs whether you paths array contains all supported all parameter values =>> fallback:false
    //or just some of them =>> fallback:true
    fallback: false,
    paths: [
      { params: { meetupId: "m1" } },
      //one object per version of this dynamic page
      { params: { meetupId: "m2" } },
    ],
  };
};

// if a page component is dynamic page
//and we are using getStaticProps =>>
// we should use getStaticPaths
export const getStaticProps = async (context) => {
  // fetch data for single meetup
  console.log(context);
  const meetupId = context.params.meetupId;
  console.log(meetupId);
  return {
    props: {
      meetupData: {
        image:
          "https://upload.wikimedia.org/wikipedia/commons/b/be/KeizersgrachtReguliersgrachtAmsterdam.jpg",
        id: meetupId,
        title: "First Meetup",
        address: "Some street 5, some city",
        description: "This is a first meetup",
      },
    },
  };
};

export default MeetupDetails;
