/**
 * OperatorsTab.js
 * -----------------------------------------
 * Displays list of OPERATORS for Supervisor.
 *
 * Supervisor can:
 * - View operators
 * - Select operator for assignment
 */

import React from "react";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

export default function OperatorsTab({
  operators = [],
  handleOperatorSelect
}) {
  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>

      {/* Title */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Operators
      </Typography>

      {/* Empty state */}
      {!operators.length && (
        <Typography>No operators available.</Typography>
      )}

      {/* Operators list */}
      <Stack spacing={2}>
        {operators.map((op) => (
          <Card
            key={op.id}
            sx={{
              transition: "0.2s",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#f5f5f5"
              }
            }}
            onClick={() => handleOperatorSelect(op)}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PersonIcon />

                <div>
                  <Typography fontWeight={600}>
                    {op.name}
                  </Typography>

                  <Typography variant="body2">
                    {op.phone}
                  </Typography>
                </div>

              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

    </Container>
  );
}
