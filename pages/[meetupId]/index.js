import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title> {props.meetupData.title} </title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
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
  const client = await MongoClient.connect(
    "mongodb+srv://hadis:0BThiAXozb65FOmo@mycluster.fd9u8.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); //only include the id but no other field values => only fetching id

  client.close();
  return {
    // fallback key tells nextjs whether you paths array contains all supported all parameter values =>> fallback:false
    //or just some of them =>> fallback:true
    fallback: true,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

// if a page component is dynamic page
//and we are using getStaticProps =>>
// we should use getStaticPaths
export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://hadis:0BThiAXozb65FOmo@mycluster.fd9u8.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
