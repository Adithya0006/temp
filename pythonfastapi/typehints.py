def get_flow_data():
    """
    Fetches the combined Flow Steps and their Assigned Operators.
    This replaces the Node.js '/getdefflow' endpoint.
    """
    
    # Perform a LEFT JOIN to ensure we see steps even if no operator is assigned yet
    # (Though typically your upload logic ensures they come in pairs)
    results = db.query(
        ProcessFlowMaster, 
        OperatorStepMapping
    ).outerjoin(
        OperatorStepMapping, 
        ProcessFlowMaster.flow_step_id == OperatorStepMapping.flow_step_id
    ).order_by(
        ProcessFlowMaster.step_order.asc()
    ).all()

    response_data = []
    
    for step, mapping in results:
        # If mapping exists, use its data; otherwise, use defaults or step data
        row = {
            "id": mapping.step_map_id if mapping else step.flow_step_id, # Unique Key
            "pcbProcessName": step.step_name,
            
            # Operator Details (Handle cases where step exists but no operator assigned)
            "assignedTo": mapping.operator_staff_no if mapping else "",
            "assignedToName": mapping.operator_name if mapping else "",
            "assignedToNameInitial": mapping.operator_initial if mapping else "",
            
            # MRL Details
            "assignedToNameMRL": mapping.operator_MRL if mapping else step.assignedToNameMRL,
            "assignedToNameMRLExpiry": mapping.operator_MRL_Expiry if mapping else step.assignedToNameMRLExpiry
        }
        response_data.append(row)

    return {"PcbData": response_data}


get_flow_data()
