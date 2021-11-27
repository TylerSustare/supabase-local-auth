import { gql, useMutation, useQuery } from "@apollo/client";
import { supabase } from "./supabase";

const GET_CLASSROOMS = gql`
  query Classrooms {
    classrooms {
      id
    }
  }
`;

const ADD_CLASSROOM = gql`
  mutation AddClassroomMutation($newClassroomData: NewClassroomInput!) {
    addClassroom(newClassroomData: $newClassroomData) {
      lessons
    }
  }
`;

export const Home = () => {
  const [addClassroom] = useMutation(ADD_CLASSROOM, {
    refetchQueries: [GET_CLASSROOMS, "Classrooms"],
  });

  const { loading, error, data } = useQuery(GET_CLASSROOMS, {
    pollInterval: 2000,
  });
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className="App">
      <h1>Data</h1>
      <button
        onClick={() =>
          addClassroom({
            variables: {
              newClassroomData: {
                lessons: ["a", "b"],
              },
            },
          })
        }
      >
        Add New Item{" "}
      </button>
      <button onClick={async () => await supabase.auth.signOut()}>
        Sign Out
      </button>
      {data.classrooms.map((d: any) => (
        <h2 key={d.id}>ID: {d.id}</h2>
      ))}
    </div>
  );
};
