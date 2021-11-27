import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
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

  const { loading, error, data } = useQuery(GET_CLASSROOMS);

  if (loading) return <Text>Loading ...</Text>;
  if (error) {
    // return null;
    return (
      <View style={styles.container}>
        <Text>Error :(</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text>Data</Text>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          onPress={() =>
            addClassroom({
              variables: {
                newClassroomData: {
                  lessons: ["a", "b"],
                },
              },
            })
          }
          title="Add Item"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          onPress={async () => await supabase.auth.signOut()}
          title="Sign Out"
        />
      </View>
      <View style={styles.verticallySpaced}>
        {data.classrooms.map((d: any) => (
          <Text key={d.id}>ID: {d.id}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
